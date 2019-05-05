import moment from 'moment';

export default function screenFromGoTo(goTo) {
  if (!goTo) return null;

  if (goTo.startsWith('billing-')) {
    const teamId = goTo.split('-')[1];
    return {
      screenId: 'Billing',
      crumbTitle: 'Billing',
      props: {
        teamId
      }
    };
  }
  if (goTo.startsWith('team-')) {
    const teamId = goTo.split('-')[1];
    return {
      screenId: 'Team',
      crumbTitle: 'Team',
      props: {
        teamId
      }
    };
  }
  if (goTo === 'teamCreate') {
    return {
      screenId: 'TeamCreate',
      crumbTitle: 'Create Team'
    };
  }

  if (goTo === 'planNextWeek') {
    const now = moment();

    let year = now.year();
    let week = now.week();
    now.add(1, 'week');
    if (now.week() < week) {
      year = year + 1;
    }
    return {
      screenId: 'Planning',
      crumbTitle: 'Planning',
      props: {
        initialYearWeek: `${year}-${now.week()}`
      }
    };
  }

  return null;
}
