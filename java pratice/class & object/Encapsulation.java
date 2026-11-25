class Student {

    private String name;
    private int age;

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public int getAge() {
        return age;
    }
}

public class Encapsulation {
    public static void main(String[] args) {

        Student s = new Student();

        s.setName("Ravi");
        s.setAge(22);

        System.out.println(s.getName());
        System.out.println(s.getAge());
    }
}
