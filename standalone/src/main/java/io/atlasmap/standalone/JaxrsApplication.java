/*
 * Copyright (C) 2017 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.atlasmap.standalone;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import io.atlasmap.api.AtlasException;
import io.atlasmap.csv.service.CsvService;
import io.atlasmap.dfdl.service.DfdlService;
import io.atlasmap.java.service.JavaService;
import io.atlasmap.json.service.JsonService;
import io.atlasmap.service.AtlasService;
import io.atlasmap.xml.service.XmlService;

@Component
@ApplicationPath("/v2/atlas/")
public class JaxrsApplication extends Application {

    @Bean
    public JavaService javaService() {
        return new JavaService();
    }

    @Bean
    public JsonService jsonService() {
        return new JsonService();
    }

    @Bean
    public XmlService xmlService() {
        return new XmlService();
    }

    @Bean
    public DfdlService dfdlService() {
        return new DfdlService();
    }

    @Bean
    public CsvService csvService() { return new CsvService(); }

    @Bean
    public AtlasService atlasService() throws AtlasException {
        return new AtlasService();
    }

    @Bean
    public MappingService mappingService() throws AtlasException {
        return new MappingService();
    }
}
