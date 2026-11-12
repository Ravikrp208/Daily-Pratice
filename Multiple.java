class Student {

    String name;
    int age;

    void display() {
        System.out.println(name + " " + age);
    }
}

public class Main {

    public static void main(String[] args) {

        Student s1 = new Student();

        s1.name = "Ravi";
        s1.age = 22;

        Student s2 = new Student();

        s2.name = "Aman";
        s2.age = 23;

        Student s3 = new Student();

        s3.name = "Rahul";
        s3.age = 24;

        s1.display();
        s2.display();
        s3.display();
    }
}
