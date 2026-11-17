class Employee {

    static String company = "Google";

    String name;

    Employee(String name) {
        this.name = name;
    }

    void display() {
        System.out.println(name + " " + company);
    }

    static void showCompany() {
        System.out.println(company);
    }
}

public class Main {
    public static void main(String[] args) {

        Employee e1 = new Employee("Ravi");
        Employee e2 = new Employee("Aman");

        e1.display();
        e2.display();

        Employee.showCompany();
    }
}
