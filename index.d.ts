/**
 * This file is just for preventing compilation error of TypeScript code.
 * Since `vue-auto-routing` is resolved with intecepted webpack plugin
 * and is dynamically generated, the actual implementation does not exist
 * in this package.
 */

import { RouteConfig } from 'vue-router'

declare const routes: RouteConfig[]
export default routes
