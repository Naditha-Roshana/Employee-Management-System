package jiat.ems_pro.controller;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jiat.ems_pro.dto.LoginResponseDTO;
import jiat.ems_pro.dto.UserDTO;
import jiat.ems_pro.service.AuthService;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthController {
    private final AuthService authService = new AuthService();
    @POST
    @Path("/login")
    public Response login(UserDTO userDTO) {
        LoginResponseDTO response = authService.login(userDTO);
        return Response.ok(response).build();
    }
}
