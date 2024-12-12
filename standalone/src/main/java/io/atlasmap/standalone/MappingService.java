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

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Paths;
import java.util.ArrayList;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriBuilder;
import javax.ws.rs.core.UriInfo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;

import io.atlasmap.api.AtlasContext;
import io.atlasmap.api.AtlasContextFactory;
import io.atlasmap.api.AtlasException;
import io.atlasmap.api.AtlasMappingBuilder;
import io.atlasmap.api.AtlasPreviewContext;
import io.atlasmap.api.AtlasSession;
import io.atlasmap.core.ADMArchiveHandler;
import io.atlasmap.core.AtlasUtil;
import io.atlasmap.core.DefaultAtlasContextFactory;
import io.atlasmap.core.DefaultAtlasFieldActionService;
import io.atlasmap.service.AtlasLibraryLoader.AtlasLibraryLoaderListener;
import io.atlasmap.v2.ActionDetails;
import io.atlasmap.v2.AtlasMapping;
import io.atlasmap.v2.Audits;
import io.atlasmap.v2.Json;
import io.atlasmap.v2.Mapping;
import io.atlasmap.v2.MappingFileType;
import io.atlasmap.v2.ProcessMappingRequest;
import io.atlasmap.v2.ProcessMappingResponse;
import io.atlasmap.v2.StringMap;
import io.atlasmap.v2.StringMapEntry;
import io.atlasmap.v2.Validations;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@Path("/mapping/atm/")
public class MappingService {

    private static final Logger LOG = LoggerFactory.getLogger(AtlasService.class);

    private final DefaultAtlasContextFactory atlasContextFactory = DefaultAtlasContextFactory.getInstance();
    private final AtlasPreviewContext previewContext;

    private String baseFolder = "";
    private String mappingFolder = "";
    private String libFolder = "";
    private AtlasLibraryLoader libraryLoader;

    public MappingService() throws AtlasException {
        
    }

    @PUT
    @Path("/process")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(summary = "Process Mapping", description = "Process Mapping by feeding input data")
    @RequestBody(description = "Mapping file content", content = @Content(schema = @Schema(implementation = AtlasMapping.class)))
    @ApiResponses({
        @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = ProcessMappingResponse.class)), description = "Return a mapping result"),
        @ApiResponse(responseCode = "204", description = "Skipped empty mapping execution") })
    public Response processMappingRequest(InputStream request, @Context UriInfo uriInfo) {
        ProcessMappingRequest pmr = fromJson(request, ProcessMappingRequest.class);
        if (pmr.getAtlasMapping() != null) {
            throw new WebApplicationException("Whole mapping execution is not yet supported");
        }
        Mapping mapping = pmr.getMapping();
        if (mapping == null) {
            return Response.noContent().build();
        }
        Audits audits = null;
        try {
            if (LOG.isDebugEnabled()) {
                LOG.debug("Preview request: {}", new String(toJson(mapping)));
            }
            audits = previewContext.processPreview(mapping);
        } catch (AtlasException e) {
            throw new WebApplicationException("Unable to process mapping preview", e);
        }
        ProcessMappingResponse response = new ProcessMappingResponse();
        response.setMapping(mapping);
        if (audits != null) {
            response.setAudits(audits);
        }
        byte[] serialized = toJson(response);
        if (LOG.isDebugEnabled()) {
            LOG.debug("Preview outcome: {}", new String(serialized));
        }
        return Response.ok().entity(serialized).build();
    }
}
