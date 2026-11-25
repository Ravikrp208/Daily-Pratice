class Car {

    String brand;
    int speed;

    void start() {
        System.out.println(brand + " is starting");
    }

    void stop() {
        System.out.println(brand + " is stopping");
    }
}

public class Stopmethod {
    public static void main(String[] args) {

        Car c1 = new Car();

        c1.brand = "BMW";
        c1.speed = 200;

        c1.start();
        c1.stop();
    }
}
