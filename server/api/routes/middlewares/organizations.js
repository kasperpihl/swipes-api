import config from 'config';
import r from 'rethinkdb';
import {
  string,
  array,
  object,
} from 'valjs';
import stripePackage from 'stripe';
import {
  dbOrganizationsCreate,
  dbOrganizationsGetInfoFromInvitationToken,
  dbOrganizationsGetSingle,
  dbOrganizationsPromoteToAdmin,
  dbOrganizationsDemoteAnAdmin,
  dbOrganizationsTransferOwnership,
  dbOrganizationsDisableUser,
  dbOrganizationsDisableAllUsers,
  dbOrganizationsEnableUser,
  dbOrganizationsUpdateStripeCustomerIdAndPlan,
  dbOrganizationsUpdateStripeSubscriptionId,
  dbOrganizationsUpdateStripeSubscriptionPlan,
  dbOrganizationsAddPendingUser,
  dbOrganizationsActivateUser,
  dbOrganizationsMilestoneReorder,
  dbOrganizationsMilestoneAdd,
  dbOrganizationsMilestoneRemove,
} from './db_utils/organizations';
import {
  dbUsersAddOrganization,
} from './db_utils/users';
import {
  valLocals,
  generateSlackLikeId,
  getDownloadLinks,
} from '../../utils';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';

const stripeConfig = config.get('stripe');
const stripe = stripePackage(stripeConfig.secretKey);

const organizationsCreate = valLocals('organizationsCreate', {
  user_id: string.require(),
  organization_name: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_name,
  } = res.locals;

  const organizationId = generateSlackLikeId('O');
  const organization = {
    id: organizationId,
    name: organization_name,
    owner_id: user_id,
    admins: [],
    active_users: [user_id],
    milestone_order: [],
    created_at: r.now(),
    updated_at: r.now(),
    trial: {
      started_at: r.now(),
      ending_at: r.now().add(1296000), // 15 days
      started_by: user_id,
    },
  };

  return dbOrganizationsCreate({ organization })
    .then((result) => {
      const organization = result.changes[0].new_val;

      setLocals({
        organization,
        organization_id: organization.id,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsAddToUser = valLocals('organizationsAddToUser', {
  user_id: string.require(),
  organization_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
  } = res.locals;

  return dbUsersAddOrganization({ user_id, organization_id })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsAddPendingUsers = valLocals('organizationsAddPendingUsers', {
  organization_id: string.require(),
  user: object.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    user,
  } = res.locals;
  const userId = user.id;

  dbOrganizationsAddPendingUser({ organization_id, user_id: userId })
    .then((result) => {
      const organizationChanges = result.changes[0];
      const organization = organizationChanges.new_val || organizationChanges.old_val;

      setLocals({
        organization,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsGetInfoFromInvitationToken = valLocals('organizationsGetInfoFromInvitationToken', {
  userId: string,
  organizationId: string,
  invitation_token: string,
}, (req, res, next, setLocals) => {
  const {
    userId,
    organizationId,
    invitation_token,
  } = res.locals;
  if (invitation_token === 'SW-091959') {
    setLocals({
      download_links: getDownloadLinks(),
    });

    return next();
  }
  const fields = ['id', 'profile', 'activated'];

  return dbOrganizationsGetInfoFromInvitationToken({
    user_id: userId,
    organization_id: organizationId,
    fields,
  })
    .then((results) => {
      const {
        me,
        organization,
        invited_by,
      } = results;

      setLocals({
        me,
        organization,
        invited_by,
        download_links: getDownloadLinks(),
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsGetSingle = valLocals('organizationsGetSingle', {
  organization_id: string,
}, (req, res, next, setLocals) => {
  const {
    organization_id,
  } = res.locals;

  if (!organization_id) {
    return next();
  }

  return dbOrganizationsGetSingle({ organization_id })
    .then((organization) => {
      setLocals({
        organization,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsCheckOwnerDisabledUser = valLocals('organizationsCheckOwnerDisabledUser', {
  user_to_disable_id: string.require(),
  organization: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_to_disable_id,
    organization,
  } = res.locals;
  const {
    owner_id,
  } = organization;

  if (owner_id === user_to_disable_id) {
    return next(new SwipesError('The owner can\'t be disabled. Should transfer owner rights first.'));
  }

  return next();
});
const organizationsCheckIsDisableValid = valLocals('organizationsCheckIsDisableValid', {
  user_to_disable_id: string.require(),
  organization: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_to_disable_id,
    organization,
  } = res.locals;
  const {
    active_users,
    pending_users,
  } = organization;

  if (!active_users.includes(user_to_disable_id) && !pending_users.includes(user_to_disable_id)) {
    return next(new SwipesError('This user is not part of that organization or it\'s disabled from it.'));
  }

  return next();
});
const organizationsCheckAdminRights = valLocals('organizationsCheckAdminRights', {
  user_id: string.require(),
  organization: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization,
  } = res.locals;
  const {
    owner_id,
    admins,
  } = organization;

  if (owner_id !== user_id && !admins.includes(user_id)) {
    return next(new SwipesError('Only owners and admins can do this action'));
  }

  return next();
});
const organizationsCheckOwnerRights = valLocals('organizationsCheckOwnerRights', {
  user_id: string.require(),
  organization: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization,
  } = res.locals;
  const {
    owner_id,
  } = organization;

  if (owner_id !== user_id) {
    return next(new SwipesError('Only owners can do this action'));
  }

  return next();
});
const organizationsCheckOwnerRightsNot = valLocals('organizationsCheckOwnerRightsNot', {
  user_id: string.require(),
  organization: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization,
  } = res.locals;
  const {
    owner_id,
  } = organization;

  if (owner_id === user_id) {
    return next(new SwipesError('Owners can\'t do this action'));
  }

  return next();
});
const organizationsPromoteToAdmin = valLocals('organizationsPromoteToAdmin', {
  organization_id: string.require(),
  user_to_promote_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    user_to_promote_id,
  } = res.locals;

  dbOrganizationsPromoteToAdmin({ organization_id, user_id: user_to_promote_id })
    .then((result) => {
      const changes = result.changes[0];
      const organization = changes.new_val || changes.old_val;

      setLocals({
        organization,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsDemoteAnAdmin = valLocals('organizationsDemoteAnAdmin', {
  organization_id: string.require(),
  user_to_demote_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    user_to_demote_id,
  } = res.locals;

  dbOrganizationsDemoteAnAdmin({ organization_id, user_id: user_to_demote_id })
    .then((result) => {
      const changes = result.changes[0];
      const organization = changes.new_val || changes.old_val;

      setLocals({
        organization,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsChangeStripeCustomerEmail = valLocals('organizationsChangeStripeCustomerEmail', {
  organization: object.require(),
  user: object.require(),
}, (req, res, next, setLocals) => {
  const {
    organization,
    user,
  } = res.locals;
  const {
    email,
  } = user;
  const {
    stripe_customer_id,
  } = organization;
  const args = [];

  if (!stripe_customer_id) {
    return next();
  }

  args.push(stripe_customer_id);
  args.push({ email });

  return stripe.customers.update(...args)
    .then(() => {
      return next();
    }).catch((err) => {
      return next(new SwipesError(err));
    });
});
const organizationsTransferOwnership = valLocals('organizationsTransferOwnership', {
  user_id: string.require(),
  organization_id: string.require(),
  user_to_transfer_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    user_to_transfer_id,
  } = res.locals;

  dbOrganizationsTransferOwnership({ organization_id, user_id, user_to_transfer_id })
    .then((result) => {
      const changes = result.changes[0];
      const organization = changes.new_val || changes.old_val;

      setLocals({
        organization,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsDisableUser = valLocals('organizationsDisableUser', {
  organization_id: string.require(),
  user_to_disable_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    user_to_disable_id,
  } = res.locals;

  dbOrganizationsDisableUser({ organization_id, user_to_disable_id })
    .then((result) => {
      if (result.changes) {
        const changes = result.changes[0];
        const organization = changes.new_val || changes.old_val;

        setLocals({
          organization,
        });

        return next();
      }

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsDisableAllUsers = valLocals('organizationsDisableAllUsers', {
  organization_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
  } = res.locals;

  dbOrganizationsDisableAllUsers({ organization_id })
    .then((result) => {
      const oldVal = result.changes[0].old_val;
      const users = oldVal.active_users.concat(oldVal.pending_users);

      setLocals({
        users_to_notify: users,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsDeletedQueueMessage = valLocals('organizationsDeletedQueueMessage', {
  users_to_notify: array.require(),
  organization_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    users_to_notify,
    organization_id,
  } = res.locals;

  const queueMessage = {
    users_to_notify,
    organization_id,
    event_type: 'organization_deleted',
  };

  setLocals({
    queueMessage,
    messageGroupId: organization_id,
  });

  return next();
});
const organizationsActivateUser = valLocals('organizationsActivateUser', {
  organization_id: string.require(),
  user_to_activate_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    user_to_activate_id,
  } = res.locals;

  dbOrganizationsActivateUser({ organization_id, user_to_activate_id })
    .then((result) => {
      const changes = result.changes[0];
      const organization = changes.new_val || changes.old_val;

      setLocals({
        organization,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsEnableUser = valLocals('organizationsEnableUser', {
  organization_id: string.require(),
  user_to_enable_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    user_to_enable_id,
  } = res.locals;

  dbOrganizationsEnableUser({ organization_id, user_to_enable_id })
    .then((result) => {
      const changes = result.changes[0];
      const organization = changes.new_val || changes.old_val;

      setLocals({
        organization,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsCreatedQueueMessage = valLocals('organizationsCreatedQueueMessage', {
  user_id: string.require(),
  organization: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization,
  } = res.locals;
  const queueMessage = {
    user_id,
    organization,
    event_type: 'organization_created',
  };

  setLocals({
    queueMessage,
    messageGroupId: organization.id,
  });

  return next();
});
const organizationsUpdatedQueueMessage = valLocals('organizationsUpdatedQueueMessage', {
  organization: object.require(),
}, (req, res, next, setLocals) => {
  const {
    organization,
  } = res.locals;
  const queueMessage = {
    // we are using the owner_id here because is some cases the user_id is not
    // in the organization anymore when this middleware gets called
    // for example: organization.leave
    user_id: organization.owner_id,
    organization,
    event_type: 'organization_updated',
  };

  setLocals({
    queueMessage,
    messageGroupId: organization.id,
  });

  return next();
});
const organizationsUserJoinedQueueMessage = valLocals('organizationsUserJoinedQueueMessage', {
  user_id: string.require(),
  organization_id: string.require(),
  organization: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    organization,
  } = res.locals;
  const event_type = 'organization_user_joined';
  const queueMessage = {
    event_type,
    user_id,
    organization_name: organization.name,
    notification_id_sufix: `${organization_id}-${event_type}`,
  };

  setLocals({
    queueMessage,
    messageGroupId: organization_id,
  });

  return next();
});
const organizationsCreateStripeCustomer = valLocals('organizationsCreateStripeCustomer', {
  organization_id: string.require(),
  organization: object.require(),
  ownerUser: object.as({
    email: string.format('email').require(),
  }).require(),
  stripe_token: string.require(),
  plan: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    organization,
    ownerUser,
    stripe_token,
    plan,
  } = res.locals;
  const {
    email,
  } = ownerUser;

  const args = [];
  let funcName = 'create';
  if (organization.stripe_customer_id) {
    funcName = 'update';
    args.push(organization.stripe_customer_id);
  }

  args.push({
    email,
    source: stripe_token,
    description: organization.name,
    metadata: {
      plan,
    },
  });

  return stripe.customers[funcName](...args).then((customer) => {
    const stripeCustomerId = customer.id;

    setLocals({
      stripeCustomerId,
    });

    dbOrganizationsUpdateStripeCustomerIdAndPlan({
      organization_id,
      stripe_customer_id: stripeCustomerId,
      plan,
    })
      .then((result) => {
        const changes = result.changes[0];
        const organization = changes.new_val || changes.old_val;

        setLocals({
          organization,
        });

        return next();
      })
      .catch((err) => {
        return next(err);
      });
  }).catch((err) => {
    return next(new SwipesError(err));
  });
});
const organizationsCreateSubscriptionCustomer = valLocals('organizationsCreateSubscriptionCustomer', {
  organization: object,
}, (req, res, next, setLocals) => {
  const {
    organization,
  } = res.locals;

  if (!organization) {
    return next();
  }

  const {
    plan,
    stripe_customer_id,
  } = organization;
  const subscription = {
    plan: plan === 'yearly' ? stripeConfig.yearlyPlanId : stripeConfig.monthlyPlanId,
    quantity: organization.active_users.length,
  };
  const args = [];

  if (!stripe_customer_id) {
    return next();
  }

  subscription.customer = stripe_customer_id;

  args.push(subscription);

  return stripe.subscriptions.create(...args)
    .then((subscription) => {
      const stripeSubscriptionId = subscription.id;

      dbOrganizationsUpdateStripeSubscriptionId({
        organization_id: organization.id,
        stripe_subscription_id: stripeSubscriptionId,
      })
        .then((result) => {
          const changes = result.changes[0];
          const organization = changes.new_val || changes.old_val;

          setLocals({
            organization,
          });

          return next();
        })
        .catch((err) => {
          return next(err);
        });
    }).catch((err) => {
      return next(new SwipesError(err));
    });
});
const organizationsUpdateSubscriptionQuantity = valLocals('organizationsUpdateSubscriptionQuantity', {
  organization: object,
}, (req, res, next, setLocals) => {
  const {
    organization,
  } = res.locals;

  if (!organization) {
    return next();
  }

  const {
    plan,
    stripe_customer_id,
    stripe_subscription_id,
  } = organization;
  const subscription = {
    plan: plan === 'yearly' ? stripeConfig.yearlyPlanId : stripeConfig.monthlyPlanId,
    quantity: organization.active_users.length,
  };
  const args = [];

  if (!stripe_customer_id || !stripe_subscription_id) {
    return next();
  }

  args.push(stripe_subscription_id);
  args.push(subscription);

  return stripe.subscriptions.update(...args)
    .then((subscription) => {
      const stripeSubscriptionId = subscription.id;

      dbOrganizationsUpdateStripeSubscriptionId({
        organization_id: organization.id,
        stripe_subscription_id: stripeSubscriptionId,
      })
        .then((result) => {
          const changes = result.changes[0];
          const organization = changes.new_val || changes.old_val;

          setLocals({
            organization,
          });

          return next();
        })
        .catch((err) => {
          return next(err);
        });
    }).catch((err) => {
      return next(new SwipesError(err));
    });
});
const organizationsUpdateStripeSubscriptionPlan = valLocals('organizationsUpdateStripeSubscriptionPlan', {
  organization_id: string.require(),
  plan_to_change: string.require(),
  organization: object,
}, async (req, res, next, setLocals) => {
  try {
    const {
      organization_id,
      plan_to_change,
      organization,
    } = res.locals;

    if (!organization) {
      return next();
    }

    const mappedPlan = plan_to_change === 'yearly' ? stripeConfig.yearlyPlanId : stripeConfig.monthlyPlanId;
    const {
      plan,
      stripe_subscription_id,
    } = organization;

    if (mappedPlan === plan) {
      // Can't change the plan to the current one.
      return next(new SwipesError(`You are already on the ${plan} plan.`));
    }

    const subscription = await stripe.subscriptions.retrieve(stripe_subscription_id);

    await stripe.subscriptions.update(stripe_subscription_id, {
      items: [{
        id: subscription.items.data[0].id,
        plan: mappedPlan,
        quantity: organization.active_users.length,
      }],
    });

    return dbOrganizationsUpdateStripeSubscriptionPlan({
      organization_id,
      plan: plan_to_change,
    })
      .then((result) => {
        const changes = result.changes[0];
        const organization = changes.new_val || changes.old_val;

        setLocals({
          organization,
        });

        return next();
      })
      .catch((err) => {
        return next(err);
      });
  } catch (e) {
    return next(e);
  }
});
const organizationsUpdateStripeCardDetails = valLocals('organizationsUpdateStripeCardDetails', {
  organization: object.require(),
  stripe_token: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization,
    stripe_token,
  } = res.locals;

  if (!organization) {
    return next();
  }

  const {
    stripe_customer_id,
  } = organization;

  if (!stripe_customer_id) {
    return next();
  }

  return stripe.customers.update(stripe_customer_id, {
    source: stripe_token,
  })
    .then(() => {
      return next();
    }).catch((err) => {
      return next(new SwipesError(err));
    });
});
const organizationsCancelSubscription = valLocals('organizationsCancelSubscription', {
  organization: object,
}, (req, res, next, setLocals) => {
  const {
    organization,
  } = res.locals;

  if (!organization) {
    return next();
  }

  const {
    stripe_subscription_id,
  } = organization;
  const args = [];

  if (!stripe_subscription_id) {
    return next();
  }

  args.push(stripe_subscription_id);

  return stripe.subscriptions.del(...args)
    .then((subscription) => {
      dbOrganizationsUpdateStripeSubscriptionId({
        organization_id: organization.id,
        stripe_subscription_id: null,
      })
        .then((result) => {
          const changes = result.changes[0];
          const organization = changes.new_val || changes.old_val;

          setLocals({
            organization,
          });

          return next();
        })
        .catch((err) => {
          return next(err);
        });
    }).catch((err) => {
      return next(new SwipesError(err));
    });
});
const organizationsUsersInvitedUserQueueMessage = valLocals('organizationsUsersInvitedUserQueueMessage', {
  user: object.require(),
  organization: object,
}, (req, res, next, setLocals) => {
  const {
    user,
    organization,
  } = res.locals;

  if (!organization) {
    return next();
  }

  const userId = user.id;
  const queueMessage = {
    organization,
    user_id: userId,
    event_type: 'organization_user_invited',
  };

  setLocals({
    queueMessage,
    messageGroupId: userId,
  });

  return next();
});
const organizationsMilestoneReorder = valLocals('organizationsMilestoneReorder', {
  organization_id: string.require(),
  milestone_order: array.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    milestone_order,
  } = res.locals;

  return dbOrganizationsMilestoneReorder({
    organization_id,
    milestone_order,
  })
    .then((result) => {
      const changes = result.changes[0];
      const organization = changes.new_val || changes.old_val;

      setLocals({
        milestone_order: organization.milestone_order,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsMilestoneReorderQueueMessage = valLocals('organizationsMilestoneReorderQueueMessage', {
  user_id: string.require(),
  organization_id: string.require(),
  milestone_order: array.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    milestone_order,
  } = res.locals;

  const queueMessage = {
    user_id,
    organization_id,
    milestone_order,
    event_type: 'organization_milestone_reordered',
  };

  setLocals({
    queueMessage,
    messageGroupId: organization_id,
  });

  return next();
});
const organizationsAddMilestone = valLocals('organizationsAddMilestone', {
  organization_id: string.require(),
  milestone_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    milestone_id,
  } = res.locals;

  return dbOrganizationsMilestoneAdd({
    organization_id,
    milestone_id,
  })
    .then((result) => {
      const changes = result.changes[0];
      const organization = changes.new_val || changes.old_val;

      setLocals({
        milestone_order: organization.milestone_order,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsRemoveMilestone = valLocals('organizationsRemoveMilestone', {
  organization_id: string.require(),
  milestone_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    milestone_id,
  } = res.locals;

  return dbOrganizationsMilestoneRemove({
    organization_id,
    milestone_id,
  })
    .then((result) => {
      const changes = result.changes[0];
      const organization = changes.new_val || changes.old_val;

      setLocals({
        milestone_order: organization.milestone_order,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

export {
  organizationsCreate,
  organizationsAddToUser,
  organizationsGetInfoFromInvitationToken,
  organizationsGetSingle,
  organizationsCheckAdminRights,
  organizationsPromoteToAdmin,
  organizationsDemoteAnAdmin,
  organizationsUpdatedQueueMessage,
  organizationsCheckOwnerRights,
  organizationsTransferOwnership,
  organizationsDisableUser,
  organizationsDisableAllUsers,
  organizationsEnableUser,
  organizationsCreateStripeCustomer,
  organizationsCheckOwnerDisabledUser,
  organizationsCheckIsDisableValid,
  organizationsCreateSubscriptionCustomer,
  organizationsUpdateSubscriptionQuantity,
  organizationsUpdateStripeSubscriptionPlan,
  organizationsUpdateStripeCardDetails,
  organizationsCancelSubscription,
  organizationsAddPendingUsers,
  organizationsCreatedQueueMessage,
  organizationsActivateUser,
  organizationsCheckOwnerRightsNot,
  organizationsUsersInvitedUserQueueMessage,
  organizationsChangeStripeCustomerEmail,
  organizationsDeletedQueueMessage,
  organizationsUserJoinedQueueMessage,
  organizationsMilestoneReorder,
  organizationsMilestoneReorderQueueMessage,
  organizationsAddMilestone,
  organizationsRemoveMilestone,
};
