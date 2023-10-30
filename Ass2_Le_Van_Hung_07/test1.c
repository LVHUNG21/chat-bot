#include <stdio.h>
#include <stdint.h>
uint32_t add(uint32_t a, uint32_t b)
{
    return a + b;
}
uint32_t sub(uint32_t a, uint32_t b)
{
    return a - b;
}
uint32_t mul(uint32_t a, uint32_t b)
{
    return a * b;
}
uint32_t div(uint32_t a, uint32_t b)
{
    return a / b;
}

int main()
{
    uint32_t a = 5;
    uint32_t b = 4;
    uint8_t option;
    uint32_t (*funcPtr[])(uint32_t, uint32_t)={
        ['+'] = &add, // + is 43 in assci
        ['-'] = &sub,
        ['*'] = &mul,
        ['/'] = &div

    };

    // funcPtr[0] = {['+'] = &add};
    // funcPtr[1] = &sub;
    // funcPtr[2] = &mul;
    // funcPtr[3] = &div;

    printf("please enter your optiorn\n");
    fflush(stdin);
    scanf("%c", &option);

    switch (option)
    {
    case '+':
        printf("result:%d\n", (*funcPtr['+'])(a, b));
        break;
    case '-':
        printf("result:%d\n", funcPtr[1](a, b));
        break;
    case '*':
        printf("result:%d\n", funcPtr[2](a, b));
        break;
    case '/':
        printf("result:%d\n", funcPtr[3](a, b));
        break;

    default:
        break;
    }
}