import config from 'config';
import r from 'rethinkdb';
import {
  string,
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
  dbOrganizationsEnableUser,
  dbOrganizationsUpdateStripeCustomerIdAndPlan,
  dbOrganizationsUpdateStripeSubscriptionId,
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
  organization_name: string,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_name,
  } = res.locals;

  if (!organization_name) {
    return next();
  }

  const organizationId = generateSlackLikeId('O');
  const organization = {
    id: organizationId,
    name: organization_name,
    owner_id: user_id,
    admins: [],
    active_users: [user_id],
    created_at: r.now(),
    updated_at: r.now(),
    trial: {
      started_at: r.now(),
      ending_at: r.now().add(1296000), // 15 days
      started_by: user_id,
    },
  };

  return dbOrganizationsCreate({ organization })
    .then(() => {
      setLocals({
        organizationId,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsAddToUser = valLocals('organizationsAddToUser', {
  user_id: string.require(),
  organizationId: string,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organizationId,
  } = res.locals;

  if (!organizationId) {
    return next();
  }

  return dbUsersAddOrganization({ user_id, organizationId })
    .then(() => {
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
  organization_id: string.require(),
  user: object.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    user,
  } = res.locals;
  const {
    organizations,
  } = user;

  if (!organizations.includes(organization_id)) {
    return next(new SwipesError('This user is not part of that organization or it\'s disabled from it.'));
  }

  return next();
});
const organizationsCheckIsEnableValid = valLocals('organizationsCheckIsEnableValid', {
  user: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user,
  } = res.locals;
  const {
    organizations,
  } = user;

  if (organizations.length > 0) {
    return next(new SwipesError('This user is part of another organization. Swipes does not support multiple organizations for now.'));
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
const organizationsUpdatedQueueMessage = valLocals('organizationsUpdatedQueueMessage', {
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
    event_type: 'organization_updated',
  };

  setLocals({
    queueMessage,
    messageGroupId: organization.id,
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
  const email = ownerUser.email;

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
const organizationsUpdateSubscriptionCustomer = valLocals('organizationsUpdateSubscriptionCustomer', {
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
  organizationsEnableUser,
  organizationsCreateStripeCustomer,
  organizationsCheckOwnerDisabledUser,
  organizationsCheckIsDisableValid,
  organizationsCheckIsEnableValid,
  organizationsCreateSubscriptionCustomer,
  organizationsUpdateSubscriptionCustomer,
};
