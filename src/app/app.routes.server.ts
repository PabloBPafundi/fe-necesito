import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  {
    path: 'product/:id', 
    renderMode: RenderMode.Client,
  },
    {
    path: 'product-answer/:id', 
    renderMode: RenderMode.Client,
  },
    {
    path: 'product/edit/:id', 
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];