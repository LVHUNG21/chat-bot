#include "linkerlist.h"
#include <stdio.h>
#include <stdlib.h>

static Node *Head = NULL;
static uint32_t length = 0;
static LinkerListStatus addNode(uint8_t ***ptr, uint8_t *data, uint32_t size);
static LinkerListStatus printt(uint8_t ***ptr, uint8_t *dummy, uint32_t size);
static LinkerListStatus delete(uint8_t ***ptr, uint8_t *data, uint32_t size);

LinkerListStatus (*functionPtr[3])(uint8_t ***, uint8_t *, uint32_t) = {&addNode, &printt, &delete};

static LinkerListStatus addNode(uint8_t ***ptr, uint8_t *data, uint32_t size)
{
    int i;
    Node *new_node = (Node *)malloc(sizeof(Node));
    new_node->addData = (uint8_t *)malloc(size);

    for (i = 0; i < size; i++)
    {
        new_node->addData[i] = data[i];
    }

    new_node->pNext = Head;
    Head = new_node;
    length++;
}
static LinkerListStatus printt(uint8_t ***ptr, uint8_t *dummy, uint32_t size)
{
    printf("length is %d\n", length);
    int i;
    Node *current_node = Head;
    uint8_t **arr = (uint8_t **)malloc(length * sizeof(uint8_t *));
    for (i = 0; i < length; i++)
    {
        uint8_t *data = current_node->addData;
        printf("%x\n", data);
        arr[i] = data;
        printf("%x\n", arr[i]);
        current_node = current_node->pNext;
    }
    *(ptr) = arr;
}
static LinkerListStatus delete(uint8_t ***ptr, uint8_t *data, uint32_t size)
{
    printf("delete function");
    uint8_t check_delete = 'y';
    Node *current_node = Head;
    Node *previous_node = NULL;

    while (current_node != NULL)
    {
        int match = 1;
        int i;
        for (i = 0; i < size; i++)
        {
            if (current_node->addData[i] != data[i])
            {
                match = 0;
            }
        }
        if (match)
        {
            if (previous_node == NULL)
            {
                Head = current_node->pNext;
            }
            else
            {
                previous_node->pNext = current_node->pNext;
            }
            
            free(current_node);
            length--;
            return; // Kết thúc hàm sau khi xóa nút
        }

        previous_node = current_node;
        current_node = current_node->pNext;
    }
}
