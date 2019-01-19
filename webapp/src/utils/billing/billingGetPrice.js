export default (organization, plan) => {
  const numberOfUsers = organization
    .get('users')
    .filter(u => u.get('status') === 'active').size;

  let price = 7.5;
  let months = 1;

  if (plan === 'yearly') {
    price = 6;
    months = 12;
  }
  return price * months * numberOfUsers;
};
