package jiat.ems_pro.dto;

import java.io.Serializable;

public class RoleDTO implements Serializable {
    private int id;
    private String roleName;

    public RoleDTO() {
    }

    public int getId() {
        return id;
    }

    public void setId(int rId) {
        this.id = id;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
