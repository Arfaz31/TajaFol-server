import { Router } from 'express';
import { AuthRoutes } from '../module/Auth/auth.route';
import { UserRoutes } from '../module/User/user.routes';
import { CategoryRoutes } from '../module/Category/category.routes';
import { SubcategoryRoutes } from '../module/Subcategory/subcategory.routes';

const middleWareRouter = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/subcategory',
    route: SubcategoryRoutes,
  },
];

moduleRoutes.forEach((route) => middleWareRouter.use(route.path, route.route));

export const MiddlewareRoutes = middleWareRouter;
