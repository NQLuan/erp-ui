import Index from '../pages/index.vue';
import login from '../pages/login/index.vue';
import datepicker from '../pages/calendar/index.vue';
import id_change_password from '../pages/changepassword/index.vue';
import CreateTeam from '../pages/createteam/index.vue';
import EditLunch from '../pages/editLunch/index.vue';
import ListTable from '../pages/editprofile/_id/index.vue';
import id_edit_team from '../pages/addMember/_id/index.vue';
import EditTeam from '../pages/editteam/_id/index.vue';
import id_list_table from '../pages/employeelist/index.vue';
import id_import from '../pages/import/index.vue';
import id_invite_form from '../pages/invite/index.vue';
import LeaveDayStatistic from '../pages/leavedaystatistic/index.vue';
import LeaveManage from '../pages/leavemanage/index.vue';
import id_leaves from '../pages/leavesday/index.vue';
import LunchStatistic from '../pages/lunchStatistic/index.vue';
import id_profile from '../pages/photos/_id/index.vue';
import profile from '../pages/profile/_id/index.vue';
import ResetPassword from '../pages/resetPassword/index.vue';
import SuccessPage from '../pages/successpage/index.vue';
import id_team_table from '../pages/team/_id/index.vue';
import team_table from '../pages/team/index.vue';
import UserCalendar from '../pages/userCalendar/index.vue';
import UserLunchStatistic from '../pages/userLunchStatistic/index.vue';
import id_verify from '../pages/verify/index.vue';

export const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
  },
  {
    path: '/login',
    name: 'Login',
    component: login,
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: datepicker,
  },
  ,{
    path: '/changepassword',
    name: 'ChangePassword',
    component: id_change_password,
  },
  {
    path: '/createteam',
    name: 'CreateTeam',
    component: CreateTeam,
  }
  ,{
    path: '/editLunch',
    name: 'EditLunch',
    component: EditLunch,
  },
  {
    path: '/editprofile/:id',
    name: 'ListTable',
    component: ListTable,
  },
  {
    path: '/addMember/:id',
    name: 'AddMember',
    component: id_edit_team,
  },
  {
    path: '/editteam',
    name: 'EditTeam',
    component: EditTeam,
  },
  {
    path: '/employeelist',
    name: 'EmployeeList',
    component: id_list_table,
  },
  {
    path: '/import',
    name: 'Import',
    component: id_import,
  },
  {
    path: '/invite',
    name: 'Invite',
    component: id_invite_form,
  }
  ,{
    path: '/leavedaystatistic',
    name: 'LeaveDayStatistic',
    component: LeaveDayStatistic,
  },
  {
    path: '/leavemanage',
    name: 'LeaveManage',
    component: LeaveManage,
  },
  {
    path: '/leavesday',
    name: 'LeavesDay',
    component: id_leaves,
  },
  {
    path: '/lunchStatistic',
    name: 'LunchStatistic',
    component: LunchStatistic,
  },
  {
    path: '/photos/:id',
    name: 'Photos',
    component: id_profile,
  },
  {
    path: '/profile/:id',
    name: 'profile',
    component: profile,
  },
  {
    path: '/resetPassword',
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: datepicker,
  },
  {
    path: '/successpage',
    name: 'SuccessPage',
    component: SuccessPage,
  },
  {
    path: '/team/:id',
    name: 'Team-id',
    component: id_team_table,
  }
  ,
  {
    path: '/team',
    name: 'Team',
    component: team_table,
  },
  {
    path: '/userCalendar',
    name: 'UserCalendar',
    component: UserCalendar,
  },
  {
    path: '/userLunchStatistic',
    name: 'UserLunchStatistic',
    component: UserLunchStatistic,
  },
  {
    path: '/verify',
    name: 'Verify',
    component: id_verify,
  }


];