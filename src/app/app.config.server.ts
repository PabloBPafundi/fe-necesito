import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';



const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: 'PRERENDER_STRATEGY',
      useValue: {
        default: 'none', 
        ignoreDynamicRoutes: true
      }
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
