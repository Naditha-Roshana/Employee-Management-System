package jiat.ems_pro.controller;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jiat.ems_pro.dto.LoginResponseDTO;
import jiat.ems_pro.dto.RegisterRespDTO;
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

    @POST
    @Path("/register")
    public Response register(UserDTO userDTO, @HeaderParam("X-SECRET-CODE")  String secretCode) {
        RegisterRespDTO response = authService.register(userDTO, secretCode);
        return Response.ok(response).build();
    }

    @PUT
    @Path("/update")
    public Response update(UserDTO userDTO, @HeaderParam("X-SECRET-CODE") String secretCode) {
        RegisterRespDTO response = authService.updateUser(userDTO, secretCode);
        return Response.ok(response).build();
    }

}
