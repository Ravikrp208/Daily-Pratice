class Student {

    String name;
    int age;
    String course;

    void display() {

        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Course: " + course);

    }
}

public class StudentTest {

    public static void main(String[] args) {

        Student s1 = new Student();

        s1.name = "Ravi";
        s1.age = 22;
        s1.course = "MCA";

        s1.display();

    }
}
