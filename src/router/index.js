import store from "@/store";
import { getToken } from "@/utils/cache";
import AdminLayout from "@/views/Admin/Layout/index.vue";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import Vue from "vue";
import VueRouter from "vue-router";
NProgress.inc(0.2);
NProgress.configure({
  easing: "ease",
  speed: 1000,
  showSpinner: false,
  trickle: false,
});
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/Login",
  },
  {
    path: "/Login",
    component: () => import("@/views/Login.vue"),
  },

  {
    path: "/ForgetPassword",
    component: () => import("@/views/ForgetPassword.vue"),
  },
];

export const adminRouters = [
  {
    path: "/Admin",
    redirect: "/Admin/UserPerson",
    component: AdminLayout,
    meta: {
      title: "menu",
      isAdmin: true,
    },
    children: [

      {
        path: "/Admin/UserList",
        meta: {
          title: "UserList",
          isAdmin: true,
        },
        component: () => import("@/views/Admin/UserList"),
      },
      {
        path: "/Admin/UserPerson",
        meta: {
          title: "personal id",
          isAdmin: true,
        },
        component: () => import("@/views/Admin/UserPerson"),
      },
      {
        path: "/Admin/PasswordEdit",
        meta: {
          title: "PasswordEdit",
          isAdmin: true,
        },
        component: () => import("@/views/Admin/PasswordEdit"),
      },

      {
        path: "/Admin/CargoList",
        meta: {
          title: "product",
          isAdmin: true,
        },
        component: () => import("@/views/Admin/CargoList"),
      },

      {
        path: "/Admin/CargoTypeList",
        meta: {
          title: "Unit Of Measure",
          isAdmin: true,
        },
        component: () => import("@/views/Admin/CargoTypeList"),
      },

      {
        path: "/Admin/CustomerList",
        meta: {
          title: "CustomerList",
          isAdmin: true,
        },
        component: () => import("@/views/Admin/CustomerList"),
      },
















      {
        path: "/Admin/WarehouseList",
        meta: {
          title: "Organization",
          isAdmin: true,
        },
        component: () => import("@/views/Admin/WarehouseList"),
      },



      {
        path: "/Admin/WarehouseRelativeUserList",
        meta: {
          title: "Warehouse User",
          isAdmin: true,
        },
        component: () => import("@/views/Admin/WarehouseRelativeUserList"),
      },
    ],
  },
];

const router = new VueRouter({
  routes: [...routes, ...adminRouters], // (缩写) 相当于 routes: routes
});

// 编写导航路由
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const hasToken = getToken();

  if (hasToken) {
    if (store.getters.HasUserInfo == false) {
      await store.dispatch("GetInfo");
      if (store.getters.UserId == 0 || store.getters.UserId == null) {
        store.dispatch("Logout");
      }
    }
    //如果去往的页面是后台
    if (to.meta && to.meta.isAdmin) {
      if (
        store.getters.RoleType == "admin" ||
        store.getters.RoleType == "user"
      ) {
        next();
      } else {
        next({ path: "/" });
      }
    } else {
      if (
        store.getters.RoleType == "admin" ||
        store.getters.RoleType == "user"
      ) {
        next({ path: "/Admin" });
      } else {
        next();
      }
    }
  } else {
    if (to.meta && to.meta.isAdmin) {
      next({ path: "/Login" });
    } else {
      next();
    }
  }
  NProgress.done();
});
router.afterEach(() => {
  // finish progress bar
  window.scrollTo({ top: 0 });
  NProgress.done();
});

export default router;
