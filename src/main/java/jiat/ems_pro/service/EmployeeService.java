package jiat.ems_pro.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import jiat.ems_pro.dto.EmployeeDTO;
import jiat.ems_pro.entity.Employee;
import jiat.ems_pro.util.HibernateUtil;
import jiat.ems_pro.util.LocalDateTimeAdapter;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.time.LocalDateTime;
import java.util.List;

public class EmployeeService {
    private static final Gson GSON = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
            .create();

    public String getAllEmployees() {

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        Session hibernateSession = HibernateUtil
                .getSessionFactory()
                .openSession();

        try {

            List<Employee> employees = hibernateSession
                    .createQuery("FROM Employee", Employee.class)
                    .list();

            responseObject.addProperty("status", true);
            responseObject.addProperty("message", "Employees Loaded Successfully");
            responseObject.add("data", GSON.toJsonTree(employees));

        } catch (HibernateException e) {

            responseObject.addProperty("status", false);
            responseObject.addProperty("message", e.getMessage());

        } finally {
            hibernateSession.close();
        }

        return GSON.toJson(responseObject);
    }

    public String addEmployee(EmployeeDTO employeeDTO) {
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        boolean status = false;
        String message = "";
        if (employeeDTO.getFirstName() == null || employeeDTO.getFirstName().isBlank()) {
            message = "First Name is Required";
        } else {
            Session session = HibernateUtil.getSessionFactory().openSession();

            Employee singleEmployee = session.createNamedQuery("Employee.getByEmail", Employee.class)
                    .setParameter("email", employeeDTO.getEmail())
                    .getSingleResultOrNull();
            if (singleEmployee != null) {
                message = "Employee Already Exists";
            } else {
                Employee emp = new Employee();
                emp.setFirstName(employeeDTO.getFirstName());
                emp.setLastName(employeeDTO.getLastName());
                emp.setEmail(employeeDTO.getEmail());
                emp.setPhone(employeeDTO.getPhone());
                emp.setNic(employeeDTO.getNic());
                emp.setDepartment(employeeDTO.getDepartment());
                emp.setPosition(employeeDTO.getPosition());
                emp.setHireDate(employeeDTO.getHireDate());
                emp.setSalary(employeeDTO.getSalary());
                emp.setStatus(employeeDTO.getStatus());
                Transaction transaction = session.beginTransaction();
                try {
                    session.persist(emp);
                    transaction.commit();
                    status = true;
                    message = "Employee Added Successfully";
                } catch (HibernateException e) {
                    transaction.rollback();
                    message = "Employee Added Failed \n" + "Try Again";
                }
            }
            session.close();
        }
        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return GSON.toJson(responseObject);
    }

    public EmployeeDTO getEmployeeById(int id) {
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        try {
            Employee employee = hibernateSession.get(Employee.class, id);
            if (employee == null) {
                return null;
            }

            EmployeeDTO dto = new EmployeeDTO();
            dto.setId(employee.getId());
            dto.setFirstName(employee.getFirstName());
            dto.setLastName(employee.getLastName());
            dto.setNic(employee.getNic());
            dto.setEmail(employee.getEmail());
            dto.setPhone(employee.getPhone());
            dto.setPosition(employee.getPosition());
            dto.setDepartment(employee.getDepartment());
            dto.setHireDate(employee.getHireDate());
            dto.setSalary(employee.getSalary());
            dto.setStatus(employee.getStatus());

            return dto;

        } finally {
            hibernateSession.close();
        }
    }
}
