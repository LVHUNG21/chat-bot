#ifndef LINKEDLIST_H
#define LINKEDLIST_H
#include <stdint.h>
typedef enum
{
    LINKEDLIST_SUCCESS = 0,
    LINKEDLIST_OUT_OF_MEMORY,
    LINKEDLIST_NOT_FOUND,
    LINKEDLIST_EMPTY,
} LinkerListStatus;

extern LinkerListStatus (*functionPtr[3])(uint8_t***,uint8_t*, uint32_t);

typedef struct Node
{
    uint8_t *addData;
    struct Node *pNext;
} Node;
// LinkerListStatus addNode(uint8_t *data, uint32_t size);
// LinkerListStatus print(uint8_t ***ptr, uint32_t size);
// LinkerListStatus delete(uint8_t *data, uint32_t size)

#endif
