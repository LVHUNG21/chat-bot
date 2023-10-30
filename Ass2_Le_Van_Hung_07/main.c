#include <stdio.h>
#include <stdint.h>
#include "linkerlist.h"

struct Student
{
    uint8_t ID;
    uint32_t age;
};

struct Doctor
{
    uint8_t ID;
    uint8_t department;
};

int main()
{
    Node *Head = NULL;

    struct Student a;
    a.age = 12;
    a.ID = 112;

    struct Student b;
    b.age = 13;
    b.ID = 2;

    struct Student c;
    c.age = 132;
    c.ID = 22;
    uint8_t **ptr = NULL;
    uint8_t *ptr1 = NULL;

    uint8_t *temp = (uint8_t *)&a;
    functionPtr[0](&ptr, temp, sizeof(struct Student));

    temp = (uint8_t *)&b;
    functionPtr[0](&ptr, temp, sizeof(struct Student));

    temp = (uint8_t *)&c;
    functionPtr[0](&ptr, temp, sizeof(struct Student));

    functionPtr[1](&ptr,ptr1,sizeof(struct Student)); // In dữ liệu của struct Student

    temp=(uint8_t*)&c;
    functionPtr[2](&ptr,temp,sizeof(struct Student)); 
       functionPtr[1](&ptr,ptr1,sizeof(struct Student));

    struct Student **studentPtr = (struct Student **)(ptr);
    printf("%x %d %d\n", (*studentPtr), (*studentPtr)->age, (*studentPtr)->ID);
    studentPtr++;
    printf("%x %d %d\n", (*studentPtr), (*studentPtr)->age, (*studentPtr)->ID);
    studentPtr++;
    printf("%x %d %d\n", (*studentPtr), (*studentPtr)->age, (*studentPtr)->ID);

    // delete (temp, sizeof(struct Student));

    // ptr = print(sizeof(struct Student)); // In dữ liệu của struct Student

    // studentPtr = (struct Student **)(ptr);
    // printf("%x %d %d\n", (*studentPtr), (*studentPtr)->age, (*studentPtr)->ID);
    // studentPtr++;
    // printf("%x %d %d\n", (*studentPtr), (*studentPtr)->age, (*studentPtr)->ID);
    // studentPtr++;
    // printf("%x %d %d\n", (*studentPtr), (*studentPtr)->age, (*studentPtr)->ID);

    return 0;
}
