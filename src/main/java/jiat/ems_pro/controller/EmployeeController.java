package jiat.ems_pro.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jiat.ems_pro.dto.EmployeeDTO;
import jiat.ems_pro.entity.Employee;
import jiat.ems_pro.service.EmployeeService;
import jiat.ems_pro.util.LocalDateTimeAdapter;

import java.time.LocalDateTime;

@Path("/employees")
@Produces(MediaType.APPLICATION_JSON)
public class EmployeeController {
    private static final Gson GSON = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
            .create();

    @GET
    public Response loadEmployees() {
        String responseJson = new EmployeeService().getAllEmployees();
        return Response.ok().entity(responseJson).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addEmployee(String json) {
        EmployeeDTO empDTO = GSON.fromJson(json, EmployeeDTO.class);
        String responseJson = new EmployeeService().addEmployee(empDTO);
        return Response.ok().entity(responseJson).build();
    }

    @GET
    @Path("/{id}")
    public Response getEmployeeById(@PathParam("id") int id) {
        EmployeeDTO empDTO = new EmployeeService().getEmployeeById(id);
        if (empDTO == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Employee not found").build();
        }
        return Response.ok().entity(empDTO).build();
    }

}
