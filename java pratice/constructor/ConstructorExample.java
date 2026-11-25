class Student {

    String name;
    int age;

    Student(String n, int a) {

        name = n;
        age = a;
    }

    void display() {

        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
    }
}

public class ConstructorExample {

    public static void main(String[] args) {

        Student s1 = new Student("Ravi", 22);

        Student s2 = new Student("Aman", 23);

        s1.display();
        s2.display();
    }
}