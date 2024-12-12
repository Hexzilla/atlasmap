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
package io.atlasmap.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.atlasmap.api.AtlasContext;
import io.atlasmap.api.AtlasContextFactory.Format;
import io.atlasmap.api.AtlasSession;
import io.atlasmap.core.DefaultAtlasContextFactory;
import io.atlasmap.v2.Json;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@Path("/mapping/adm/")
public class MappingService {

    private static final Logger LOG = LoggerFactory.getLogger(AtlasService.class);

    private final DefaultAtlasContextFactory atlasContextFactory = DefaultAtlasContextFactory.getInstance();

    private byte[] toJson(Object value) {
        try {
            return Json.mapper().writeValueAsBytes(value);
        } catch (JsonProcessingException e) {
            throw new WebApplicationException(e, Status.INTERNAL_SERVER_ERROR);
        }
    }

    private String toJsonString(Object value) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new WebApplicationException(e, Status.INTERNAL_SERVER_ERROR);
        }
    }

    protected <T> T fromJson(InputStream value, Class<T>clazz) {
        try {
            return Json.mapper().readValue(value, clazz);
        } catch (IOException e) {
            throw new WebApplicationException(e, Response.Status.BAD_REQUEST);
        }
    }

    @GET
    @Path("/simple")
    @Produces(MediaType.TEXT_PLAIN)
    @Operation(summary = "Simple", description ="Simple hello service")
    @ApiResponses(@ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = String.class)), description = "Return a response"))
    public String simpleHelloWorld(@Parameter(description = "From") @QueryParam("from") String from) {
        return "Got it! " + from;
    }

    @PUT
    @Path("/process")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(summary = "Process Mapping", description = "Process Mapping by feeding input data")
    @RequestBody(description = "Mapping file content", content = @Content(schema = @Schema(implementation = MappingRequest.class)))
    @ApiResponses({
        @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = MappingResponse.class)), description = "Return a mapping result"),
        @ApiResponse(responseCode = "204", description = "Skipped empty mapping execution") })
    public Response processMappingRequest(InputStream request, @Context UriInfo uriInfo) {
        MappingRequest mappingRequest = fromJson(request, MappingRequest.class);
        if (mappingRequest.getAdm() == null) {
            throw new WebApplicationException("Invalid Payload");
        }

        MappingResponse response = new MappingResponse();
        
        try {
            try (InputStream inputStream = new ByteArrayInputStream(mappingRequest.getAdm()))
            {
                AtlasContext context = atlasContextFactory.createContext(Format.ADM, inputStream);
                AtlasSession session = context.createSession();
                session.setSourceDocument("Source", mappingRequest.getSource());
                context.process(session);

                Map<String, Object> targetDoc = session.getTargetProperties();
                String result = toJsonString(targetDoc);

                response.setMappingResult(result);
            }
        } catch (Exception e) {
            throw new WebApplicationException(e, Status.INTERNAL_SERVER_ERROR);
        }

        byte[] serialized = toJson(response);
        if (LOG.isDebugEnabled()) {
            LOG.debug("Preview outcome: {}", new String(serialized));
        }
        return Response.ok().entity(serialized).build();
    }
}
