package jiat.ems_pro.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
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
    public Response getEmployeeById(@PathParam("id") Integer id) {
        EmployeeDTO empDTO = new EmployeeService().getEmployeeById(id);
        if (empDTO == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Employee not found").build();
        }
        return Response.ok().entity(empDTO).build();
    }

    @Path("/empNI")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadEmpNI() {
        String responseJson = new EmployeeService().loadEmployeesForSelection();
        return Response.ok().entity(responseJson).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteEmployee(@PathParam("id") int id) {
        String responseJson = new EmployeeService().deleteEmployeeById(id);
        return Response.ok().entity(responseJson).build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateEmployee(String json) {
        EmployeeDTO employeeDTO = GSON.fromJson(json, EmployeeDTO.class);
        String responseJson = new EmployeeService().updateEmployeeById(employeeDTO);
        return Response.ok().entity(responseJson).build();
    }

    @PUT
    @Path("/status")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateEmployeeStatus(String json) {
        JsonObject obj = JsonParser.parseString(json).getAsJsonObject();
        int id = obj.get("id").getAsInt();
        String status = obj.get("status").getAsString();
        String responseJson = new EmployeeService().updateEmployeeStatus(id, status);
        return Response.ok().entity(responseJson).build();
    }
}
