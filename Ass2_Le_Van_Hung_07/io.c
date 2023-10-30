#include "array.h"

static char * Message[] = {
	"Index is out of range",	//	ARRAY_OUT_OF_RANGE	= 0,
	"Command Successfully",		//	ARRAY_SUCCESSFUL 	= 1,
	"Array is Empty",			//	ARRAY_EMPTY 		= 2,
	"Array is Full"				//	ARRAY_FULL  		= 3
	
};

char * IO_Message(StatusType status)
{
	return Message[status];
}

