import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Index from './views/Index.vue'
import Home from './views/Home.vue'

import activityList from './views/activity/list.vue'
import indexActivities from './views/activity/indexActivities.vue'
import redPacket from './views/activity/redPacket.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },

    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-menu',
        leaf: true,//只有一个节点
        children: [
            { path: '/Index', component: Index, name: '首页' }
        ]
    },


    {
        path: '/',
        component: Home,
        name: '活动管理',
        iconCls: 'el-icon-menu',
        children: [
            { path: '/activityList', component: activityList, name: '活动列表' },
            { path: '/indexActivities', component: indexActivities, name: '首页活动' },
            { path: '/redPacket', component: redPacket, name: '定时红包'}
        ]
    },


    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;