package jiat.ems_pro.controller;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/test")
public class TestController {
    @GET
    public String test() {
        return "Jersey is working";
    }
}
