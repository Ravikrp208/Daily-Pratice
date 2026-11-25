class Employee {

    String name;
    double salary;

    void display() {
        System.out.println(name + " " + salary);
    }
}

public class EmployeeTest {
    public static void main(String[] args) {

        Employee e1 = new Employee();
        Employee e2 = new Employee();

        e1.name = "Ravi";
        e1.salary = 30000;

        e2.name = "Aman";
        e2.salary = 40000;

        e1.display();
        e2.display();
    }
}
