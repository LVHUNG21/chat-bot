#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
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

Node *Head = NULL;

void addNode(uint8_t *data, uint32_t size)
{
    Node *newNode = (Node *)malloc(sizeof(Node));
    newNode->addData = data;
    newNode->pNext = NULL;

    if (Head == NULL)
    {
        Head = newNode;
    }
    else
    {
        Node *current = Head;
        while (current->pNext != NULL)
        {
            current = current->pNext;
        }
        current->pNext = newNode;
    }
}

uint8_t **print(uint32_t size)
{
    Node *current_node = Head;
    uint8_t **arr = (uint8_t **)malloc(size * sizeof(uint8_t *));

    for (int i = 0; i < size; i++)
    {
        uint8_t *data = current_node->addData;
        arr[i] = data;
        current_node = current_node->pNext;
    }
    printf("%x %x\n", arr[0], arr[1]);
    return arr;
}

int main()
{
    struct Student a;
    a.age = 12;
    a.ID = 17;

    struct Student b;
    b.age = 13;
    b.ID = 2;

    uint8_t *temp = (uint8_t *)&a;
    addNode(temp, sizeof(struct Student));

    temp = (uint8_t *)&b;
    addNode(temp, sizeof(struct Student));
    uint8_t **ptr = print(2); // Get the array of pointers from the print function
    printf("%x %x\n", *ptr, *(ptr + 1));
    struct Student **studentPtr = (struct Student **)ptr;
    printf("Address: %x\n",*studentPtr);
    printf("Address: %x\n",*studentPtr);
    printf("Address: %x\n",*studentPtr);
    printf("Address: %x\n",*studentPtr);
    printf("Age: %d\n", (*studentPtr)->age);
    printf("ID: %d\n", (*studentPtr)->ID);
    ptr++;
    printf("%x\n", *ptr);
    studentPtr = (struct Student **)ptr;
    printf("ID: %d\n", (*studentPtr)->ID);
    printf("Age: %d\n", (*studentPtr)->age);

    free(ptr); // Free the dynamically allocated memory

    return 0;
}