class TestClass {
    first: number;
    testMethod(input: number): number {
        return this.first + input
    };
    constructor(first: number) {
        this.first = first;
    }
}

const one = new TestClass(1)
const two = new TestClass(2)

console.log(one.testMethod(4))
console.log(two.testMethod(4))

