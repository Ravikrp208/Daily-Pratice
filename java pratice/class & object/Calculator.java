class Rectangle {

    int length;
    int width;

    void calculateArea() {
        int area = length * width;
        System.out.println("Area: " + area);
    }
}

public class Calculator {
    public static void main(String[] args) {

        Rectangle r1 = new Rectangle();

        r1.length = 10;
        r1.width = 5;

        r1.calculateArea();
    }
}
