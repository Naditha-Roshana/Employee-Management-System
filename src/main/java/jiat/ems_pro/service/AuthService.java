package jiat.ems_pro.service;

import jiat.ems_pro.dto.LoginResponseDTO;
import jiat.ems_pro.dto.RegisterRespDTO;
import jiat.ems_pro.dto.UserDTO;
import jiat.ems_pro.entity.Employee;
import jiat.ems_pro.entity.Role;
import jiat.ems_pro.entity.User;
import jiat.ems_pro.util.HibernateUtil;
import jiat.ems_pro.validation.Validator;
import org.hibernate.Session;
import org.hibernate.Transaction;

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
            responseDTO.setUserName(userDTO.getUserName());
            responseDTO.setPassword(userDTO.getPassword());
            responseDTO.setEmpId(user.getId());
            responseDTO.setFirstName(emp.getFirstName());
            responseDTO.setLastName(emp.getLastName());
            responseDTO.setDeptName(emp.getDepartment());
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

    public RegisterRespDTO register(UserDTO userDTO, String secretCode) {
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = hibernateSession.beginTransaction();

        try {
            User exists = hibernateSession.createQuery(
                    "FROM User u WHERE u.username = :username", User.class)
                    .setParameter("username", userDTO.getUserName())
                    .uniqueResult();

            if (exists != null) {
                return new RegisterRespDTO("Username already exists", false);
            }

            Role role = hibernateSession.get(Role.class, userDTO.getRoleId());
            if (role == null) {
                return new RegisterRespDTO("Invalid role selected", false);
            }

            if(!Validator.validateRoleSecret(role.getId(), secretCode)) {
                return new RegisterRespDTO(
                        "INVALID_SECRET",
                        "Invalid Registration code for selected role",
                        false
                );
            }

            Employee emp = hibernateSession.get(Employee.class, userDTO.getEmpId());
            if (emp == null) {
                return new RegisterRespDTO("Employee not found", false);
            }

            User user = new User();
            user.setUsername(userDTO.getUserName());
            user.setPassword(userDTO.getPassword());
            user.setRole(role);
            user.setEmployee(emp);

            hibernateSession.persist(user);
            transaction.commit();

            return new RegisterRespDTO("Registration successful", true);

        } catch (Exception e) {
            transaction.rollback();
            e.printStackTrace();
            return new RegisterRespDTO("System error. Please try again later.", false);
        } finally {
            hibernateSession.close();
        }
    }

    public RegisterRespDTO updateUser(UserDTO userDTO, String secretCode) {
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = hibernateSession.beginTransaction();

        try {
            User user = hibernateSession.get(User.class, userDTO.getUserId());
            if (user == null) {
                return new RegisterRespDTO("User not found", false);
            }

            if (!Validator.validateRoleSecret(user.getRole().getId(), secretCode)) {
                return new RegisterRespDTO("Invalid secret code for selected role", false);
            }

            User existing = hibernateSession.createQuery(
                    "FROM User u WHERE u.username = :username AND u.id != :id", User.class)
                    .setParameter("username", userDTO.getUserName())
                    .setParameter("id", user.getId())
                    .uniqueResult();
            if (existing != null) {
                return new RegisterRespDTO("Username already exists", false);
            }

            user.setUsername(userDTO.getUserName());
            user.setPassword(userDTO.getPassword());

            hibernateSession.merge(user);
            transaction.commit();

            return new RegisterRespDTO("Profile updated successfully", true);

        } catch (Exception e) {
            transaction.rollback();
            e.printStackTrace();
            return new RegisterRespDTO("System error. Please try again later.", false);
        } finally {
            hibernateSession.close();
        }
    }
}
