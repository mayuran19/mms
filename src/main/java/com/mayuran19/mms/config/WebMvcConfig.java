package com.mayuran19.mms.config;

import com.mayuran19.mms.security.CurrentPlatformUserArgumentResolver;
import com.mayuran19.mms.security.CurrentTenantUserArgumentResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new CurrentPlatformUserArgumentResolver());
        resolvers.add(new CurrentTenantUserArgumentResolver());
    }
}