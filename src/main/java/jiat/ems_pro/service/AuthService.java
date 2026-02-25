package jiat.ems_pro.service;

import jiat.ems_pro.dto.LoginResponseDTO;
import jiat.ems_pro.dto.UserDTO;
import jiat.ems_pro.entity.Employee;
import jiat.ems_pro.entity.Role;
import jiat.ems_pro.entity.User;
import jiat.ems_pro.util.HibernateUtil;
import org.hibernate.Session;

public class AuthService {
    public LoginResponseDTO login(UserDTO userDTO) {
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        try {
            User user = hibernateSession.createQuery(
                            "FROM User u WHERE u.username = :username AND u.password = :password",
                            User.class
                    )
                    .setParameter("username", userDTO.getUserName())
                    .setParameter("password", userDTO.getPassword())
                    .uniqueResult();

            if (user == null) {
                LoginResponseDTO fail = new LoginResponseDTO();
                fail.setSuccess(false);
                fail.setMessage("Invalid username or password");
                return fail;
            }
            Role role = user.getRole();
            Employee emp = user.getEmployee();
            LoginResponseDTO responseDTO = new LoginResponseDTO();
            responseDTO.setSuccess(true);
            responseDTO.setMessage("Login successful");

            responseDTO.setUserId(user.getId());
            responseDTO.setEmpId(user.getId());
            responseDTO.setFirstName(emp.getFirstName());
            responseDTO.setLastName(emp.getLastName());
            responseDTO.setRoleId(role.getId());
            responseDTO.setRoleName(role.getRoleName());

            return responseDTO;

        } catch (Exception e) {
            e.printStackTrace();

            LoginResponseDTO error = new LoginResponseDTO();
            error.setSuccess(false);
            error.setMessage("Server error");
            return error;
        } finally {
            hibernateSession.close();
        }
    }
}
