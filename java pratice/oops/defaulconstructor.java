class Student {

    String name;
    int age;

    Student() {
        name = "Ravi";
        age = 22;
    }

    void display() {
        System.out.println(name);
        System.out.println(age);
    }
}

public class Defaulconstructor {

    public static void main(String[] args) {

        Student s1 = new Student();

        s1.display();
    }
}