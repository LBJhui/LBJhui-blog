# 数据结构(C 语言版)

## 线性表

```c
ADT 线性表(List)
Data
  线性表的数据对象集合为 {a1, a2, ..., an}，每个元素的类型均为 DataType。其中，除第一个元素 a1 外，每一个元素有且只有一个直接前驱元素，除了最后一个元素 an 外，每一个元素有且只有一个直接后继元素。数据元素之间的关系是一对一的关系。
Operation
  InitList(*L): 初始化操作，建立一个空的线性表 L。
  ListEmpty(L): 若线性表为空，返回 true，否则返回 false。
  ClearList(*L): 将线性表清空。
  GetElem(L, i, *e): 将线性表 L 中的第 i 个位置元素值返回给 e。
  LocateElem(L, e): 在线性表 L 中查找与给定值 e 相等的元素，若查找成功，返回该元素在表中的序号；否则返回 0。
  ListInsert(*L, i, e): 在线性表 L 中第 i 个位置插入新元素 e。
  ListDelete(*L, i, *e): 删除线性表 L 中第 i 个位置的元素，并用 e 返回其值。
  ListLength(L): 返回线性表 L 的元素个数。
endADT
```

### 线性表的顺序存储结构

插入算法的思路：

- 如果插入位置不合理，抛出异常
- 如果线性表长度大于等于数组长度，则抛出异常或动态增加容量
- 从最后一个元素开始向前遍历到第 i 个位置，分别将它们都向后移动一个位置
- 将要插入元素填入位置 i 处
- 表长加 1

删除算法的思路：

- 如果删除位置不合理，抛出异常
- 取出删除元素
- 从删除元素位置开始遍历到最后一个元素位置，分别将它们都向前移动一个位置
- 表长减 1

```c
#define MAXSIZE 20          /* 存储空间初始分配量 */
typedef int ElemType;       /* ElemType类型根据实际情况而定，这里假设为int */
typedef struct
{
  ElemType data[MAXSIZE];       /* 数组存储数据元素，最大值为MAXSIZE */
  int length;                   /* 线性表当前长度*/
}SqList;

/* 获取元素操作 */
#define OK 1
#define ERROR 0
#define TRUE 1
#define FALSE 0
typedef int Status;
/* Status是函数的类型，其值是函数结果状态代码，如OK等 */
/* 初始条件：顺序线性表L已存在，1≤i≤ListLength(L) */
/* 操作结果：用e返回L中第i个数据元素的值 */
Status GetElem(SqList L,int i,ElemType *e)
{
  if(L.length==0 || i<1 || i>L.length)
    return ERROR;
  *e=L.data[i-1];
  return OK;
}

/* 插入操作 */
/* 初始条件：顺序线性表L已存在，1≤i≤ListLength(L) */
/* 操作结果：在 L 中第 i 个位置之前插入新的数据元素 e，L 的长度加 1 */
Status ListInsert(SqList *L,int i,ElemType e)
{
  int k;
  if(L->length==MAXSIZE)  /* 顺序线性表已经满 */
    return ERROR;
  if(i<1 || i>L->length+1) /* 当 i 不在范围内时 */
    return ERROR;
  if(i<=L->length)  /* 若插入数据位置不在表尾 */
  {
    for(k=L->length-1;k>=i-1;k--) /* 将要插入位置后数据元素向后移动一位 */
      L->data[k+1]=L->data[k];
  }
  L->data[i-1]=e; /* 将新元素插入 */
  L->length++;
  return OK;
}

/* 删除操作 */
/* 初始条件：顺序线性表L已存在，1≤i≤ListLength(L) */
/* 操作结果：删除 L 中第 i 个位置的数据元素，并用 e 返回其值，L 的长度减 1 */
Status ListDelete(SqList *L,int i,ElemType *e)
{
  int k;
  if(L->length==0) /* 线性表为空 */
    return ERROR;
  if(i<1 || i>L->length) /* 删除位置不正确 */
    return ERROR;
  *e=L->data[i-1];
  if(i<L->length) /* 如果删除不是最后位置 */
  {
    for(k=i;k<L->length;k++) /* 将删除位置后继元素前移 */
      L->data[k-1]=L->data[k];
  }
  L->length--;
  return OK;
}
```

线性表的顺序存储结构，在存、读数据时，不管是哪个位置，时间复杂度都是 O(1)；而插入或删除时，时间复杂度都是 O(n)。

优点：

- 无须为表示表中元素之间的逻辑关系而增加额外的存储空间
- 可以快速地存取表中任一位置的元素

缺点：

- 插入和删除操作需要移动大量元素
- 当线性表长度变化较大时，难以确定存储空间的容量
- 造成存储空间的 “碎片”

### 线性表的链式存储结构

#### 单链表

链表中第一个结点的存储位置叫做头指针

**头指针与头结点的异同**

头指针

- 头指针是指链表指向第一个结点的指针，若链表有头结点，则是指向头结点的指针
- 头指针具有标识作用，所以常用头指针冠以链表的名字
- 无论链表是否为空，头指针均不为空。头指针是链表的必要元素

头结点

- 头结点是为了操作的统一和方便而设立的，放在第一元素结点之前，其数据域一般无意义（也可存放链表的长度）
- 有了头结点，对在第一元素结点前插入结点和删除第一结点，其操作与其它结点的操作就统一了
- 头结点不一定是链表必须要素

```c
/* 线性表的单链表存储结构 */
typedef struct Node
{
  ElemType data;
  struct Node *next;
} Node;
typedef struct Node *LinkList;  /* 定义LinkList */
```

获取链表第 i 个数据的算法思路：

1. 声明一个结点 p 指向链表第一个结点，初始化 j 从 1 开始
2. 当 j < i 时，就遍历链表，让 p 的指针向后移动，不断指向下一结点，j 累加 1
3. 若到链表末尾 p 为空，则说明第 i 个元素不存在
4. 否则查找成功，返回结点 p 的数据

```c
/* 初始条件：顺序线性表 L 已存在，1≤i≤ListLength(L) */
/* 操作结果：用 e 返回 L 中第 i 个数据元素的值 */
Status GetElem(LinkList L,int i,ElemType *e)
{
  int j;
  LinkList p;          /* 声明一结点 p */
  p = L->next;         /* 让 p 指向链表 L 的第一个结点 */
  j = 1;               /* j 为计数器 */
  while (p && j<i)   /* p 不为空或者计数器 j 还没有等于 i 时，循环继续 */
  {
    p = p->next;     /* 让 p 指向下一个结点 */
    ++j;
  }
  if (!p || j>i )
    return ERROR;    /* 第 i 个元素不存在 */
  *e = p->data;        /* 取第 i 个元素的数据 */
  return OK;
}
```

单链表第 i 个数据插入结点的算法思路：

1. 声明一结点 p 指向链表第一个结点，初始化 j 从 1 开始
2. 当 j<i 时，就遍历链表，让 p 的指针向后移动，不断指向下一结点，j 累加 1
3. 若到链表末尾 p 为空，则说明第 i 个元素不存在
4. 否则查找成功，在系统中生成一个空结点 s
5. 将数据元素 e 赋值给 s->data
6. 单链表的插入标准语句 s->next=p->next; p->next=s;
7. 返回成功

```c
/* 初始条件：顺序线性表L已存在，1≤i≤ListLength(L) */
/* 操作结果：在 L 中第 i 个位置之前插入新的数据元素 e，L 的长度加1 */
Status ListInsert(LinkList *L,int i,ElemType e)
{
  int j;
  LinkList p,s;
  p = *L;
  j = 1;
  while (p && j < i)     /* 寻找第 i 个结点 */
  {
    p = p->next;
    ++j;
  }
  if （!p || j > i）
    return ERROR;        /* 第 i 个元素不存在 */
  s = (LinkList)malloc(sizeof(Node)); /* 生成新结点（C标准函数） */
  s->data = e;
  s->next = p->next;      /* 将 p 的后继结点赋值给 s 的后继 */
  p->next = s;            /* 将 s 赋值给 p 的后继 */
  return OK;
}
```

单链表第 i 个数据删除结点的算法思路：

1. 声明一结点 p 指向链表第一个结点，初始化 j 从 1 开始
2. 当 j<i 时，就遍历链表，让 p 的指针向后移动，不断指向下一结点，j 累加 1
3. 若到链表末尾 p 为空，则说明第 i 个元素不存在
4. 否则查找成功，将欲删除的结点 p->next 赋值给 q
5. 单链表的删除标准语句 p->next=q->next;
6. 将 q 结点中的数据赋值给 e，作为返回
7. 释放 q 结点
8. 返回成功

```c
/* 初始条件：顺序线性表 L 已存在，1≤i≤ListLength(L) */
/* 操作结果：删除 L 的第 i 个数据元素，并用 e 返回其值，L 的长度减 1 */
Status ListDelete(LinkList *L, int i, ElemType *e)
{
  int j;
  LinkList p, q;
  p = *L;
  j = 1;
  while （p->next && j < i）    /* 遍历寻找第 i 个元素 */
  {
      p = p->next;
      ++j;
  }
  if （!（p->next） || j > i）
      return ERROR;        /* 第 i 个元素不存在 */
  q = p->next;
  p->next = q->next;        /* 将 q 的后继赋值给 p 的后继 */
  *e = q->data;             /* 将 q 结点中的数据给 e */
  free（q）;                /* 让系统回收此结点，释放内存 */
  return OK;
}
```

单链表整表创建的算法思路：

1. 声明一结点 p 和计数器变量 i
2. 初始化一空链表 L
3. 让 L 的头结点的指针指向 NULL，即建立一个带头结点的单链表
4. 循环：
   - 生成一新结点赋值给 p
   - 随机生成一数字赋值给 p 的数据域 p->data
   - 将 p 插入到头结点与前一新结点之间

```c
/* 随机产生 n 个元素的值，建立带表头结点的单链线性表 L（头插法） */
void CreateListHead(LinkList *L, int n)
{
  LinkList p;
  int i;
  srand(time(0));                     /* 初始化随机数种子 */
  *L = (LinkList)malloc(sizeof(Node));
  (*L)->next = NULL;                    /* 先建立一个带头结点的单链表 */
  for (i=0; i<n; i++)
  {
    p = (LinkList)malloc(sizeof(Node));/* 生成新结点 */
    p->data = rand()%100+1;          /* 随机生成 100 以内的数字 */
    p->next = (*L)->next;
    (*L)->next = p;                  /* 插入到表头 */
  }
}

/* 随机产生 n 个元素的值，建立带表头结点的单链线性表 L（尾插法） */
void CreateListTail(LinkList *L, int n)
{
  LinkList p,r;
  int i;
  srand(time(0));                       /* 初始化随机数种子 */
  *L = (LinkList)malloc(sizeof(Node));/* L为整个线性表 */
  r=*L;                                    /* r为指向尾部的结点 */
  for (i=0; i<n; i++)
  {
    p = (Node *)malloc(sizeof(Node)); /* 生成新结点 */
    p->data = rand()%100+1;        /* 随机生成 100 以内的数字 */
    r->next=p;                       /* 将表尾终端结点的指针指向新结点*/
    r = p;                           /* 将当前的新结点定义为表尾终端结点 */
  }
  r->next = NULL;                      /* 表示当前链表结束 */
}
```

单链表整表删除的算法思路如下：

1. 声明一结点 p 和 q
2. 将第一个结点赋值给 p
3. 循环：
   - 将下一结点赋值给 q
   - 释放 p
   - 将 q 赋值给 p

```c
/* 初始条件：顺序线性表 L 已存在，操作结果：将 L 重置为空表 */
Status ClearList(LinkList *L)
{
    LinkList p,q;
    p=(*L)->next;           /* p 指向第一个结点 */
    while(p)                /* 没到表尾 */
    {
        q=p->next;
        free(p);
        p=q;
    }
    (*L)->next=NULL;        /* 头结点指针域为空 */
    return OK;
}
```

单链表结构与顺序存储结构对比：

- 存储分配方式
  - 顺序存储结构用一段连续的存储单元依次存储线性表的数据元素
  - 单链表采用链式存储结构，用一组任意的存储单元存放线性表的元素
- 时间性能
  - 查找
    - 顺序存储结构：O(1)
    - 单链表：O(n)
  - 插入和删除
    - 顺序存储结构需要平均表长一半的元素，时间为 O(n)
    - 单链表在找出某位置的指针后，插入和删除时间仅为 O(1)
- 空间性能
  - 顺序存储结构需要预分配存储空间，分大了，浪费，分小了易发生上溢
  - 单链表不需要分配存储空间，只要有就可以分配，元素个数也不受限制

#### 静态链表

#### 循环链表

#### 双向链表

```c
/* 线性表的双向链表存储结构 */
typedef struct DulNode
{
  ElemType data;
  struct DuLNode *prior;      /* 直接前驱指针 */
  struct DuLNode *next;       /* 直接后继指针 */
} DulNode, *DuLinkList;
```

## 栈与队列

### 栈

```c
ADT 栈(stack)
Data
  同线性表。元素具有相同的类型，相邻元素具有前驱和后继关系。
Operation
  InitStack(*S)：初始化操作，建立一个空栈S。
  DestroyStack(*S)：若栈存在，则销毁它。
  ClearStack(*S)：将栈清空。
  StackEmpty(S)：若栈为空，返回true，否则返回false。
  GetTop(S,*e)：若栈存在且非空，用e返回S的栈顶元素。
  Push(*S,)）：若栈S存在，插入新元素e到栈S中并成为栈顶元素。
  Pop(*S,*e)：删除栈S中栈顶元素，并用e返回其值。
  StackLength(S)：返回栈S的元素个数。
```

#### 栈的顺序存储结构

```c
typedef int SElemType; /* SElemType类型根据实际情况而定，这里假设为int */
typedef struct
{
  SElemType data[MAXSIZE];
  int top;          /* 用于栈顶指针 */
}SqStack;

/* 进栈操作 */
/* 插入元素e为新的栈顶元素 */
Status Push(SqStack *S, SElemType e)
{
  if（S->top == MAXSIZE －1）  /* 栈满 */
  {
    return ERROR;
  }
  S->top++;                    /* 栈顶指针增加一 */
  S->data[S->top]=e;           /* 将新插入元素赋值给栈顶空间 */
  return OK;
}

/* 出栈操作 */
/* 若栈不空，则删除 S 的栈顶元素，用 e 返回其值，并返回 OK；否则返回 ERROR */
Status Pop(SqStack *S, SElemType *e)
{
  if(S->top==－1)
    return ERROR;
  *e=S->data[S->top];          /* 将要删除的栈顶元素赋值给 e */
  S->top－－;                  /* 栈顶指针减一 */
  return OK;
}
```

#### 两栈共享空间

```c
/* 两栈共享空间结构 */
typedef struct
{
  SElemType data[MAXSIZE];
  int top1; /* 栈 1 栈顶指针 */
  int top2; /* 栈 2 栈顶指针 */
}SqDoubleStack;

/* 插入元素 e 为新的栈顶元素 */
Status Push(SqDoubleStack *S, SElemType e, int stackNumber)
{
  if (S->top1+1==S->top2)/* 栈已满，不能再 push 新元素了 */
    return ERROR;
  if (stackNumber==1)   /* 栈 1 有元素进栈 */
    S->data[++S->top1]=e;/* 若栈 1 则先 top1+1 后给数组元素赋值 */
  else if (stackNumber==2)/* 栈 2有元素进栈 */
    S->data[－－S->top2]=e;/* 若栈 2 则先 top2－1 后给数组元素赋值 */
  return OK;
}

/* 若栈不空，则删除 S 的栈顶元素，用 e 返回其值，并返回 OK；否则返回 ERROR */
Status Pop(SqDoubleStack *S, SElemType *e, int stackNumber)
{
  if(stackNumber==1)
  {
    if(S->top1==－1)
      return ERROR; /* 说明栈 1 已经是空栈，溢出 */
    *e=S->data[S->top1--]; /* 栈 1 栈顶元素出栈 */
  }
  else if(stackNumber==2)
  {
    if(S->top2==MAXSIZE)
      return ERROR; /* 说明栈 2 已经是空栈，溢出 */
    *e=S->data[S->top2++]; /* 栈 2 栈顶元素出栈 */
  }
  return OK;
}
```

#### 栈的链式存储结构

```c
typedef struct StackNode
{
  SElemType data;
  struct StackNode *next;
}StackNode,*LinkStackPtr;
typedef struct LinkStack
{
  LinkStackPtr top;
  int count;
}LinkStack;

/* 进栈操作 */
/* 插入元素 e 为新的栈顶元素 */
Status Push(LinkStack *S, SElemType e)
{
  LinkStackPtr s=(LinkStackPtr)malloc(sizeof(StackNode));
  s->data=e;
  s->next=S->top;/* 把当前的栈顶元素赋值给新结点的直接后继 */
  S->top=s;      /* 将新的结点 s 赋值给栈顶指针 */
  S->count++;
  return OK;
}

/* 出栈操作 */
/* 若栈不空，则删除 S 的栈顶元素，用 e 返回其值，并返回 OK；否则返回 ERROR */
Status Pop(LinkStack *S,SElemType *e)
{
  LinkStackPtr p;
  if(StackEmpty(*S))
      return ERROR;
  *e=S->top->data;
  p=S->top;            /* 将栈顶结点赋值给 p */
  S->top=S->top->next; /* 使得栈顶指针下移一位，指向后一结点 */
  free(p);           /* 释放结点 p */
  S->count--;
  return OK;
}
```

### 队列

队列（queue）是只允许在一端进行插入操作，而在另一端进行删除操作的线性表。

队列是一种先进先出（First In First Out）的线性表，简称 FIFO。允许插入的一端称为队尾，允许删除的一端称为队头。

```c
ADT 队列(Queue)
Data
  同线性表。元素具有相同的类型，相邻元素具有前驱和后继关系。
Operation
  InitQueue(*)）：初始化操作，建立一个空队列 Q。
  DestroyQueue(*Q)：若队列 Q 存在，则销毁它。
  ClearQueue(*Q)：将队列 Q 清空。
  QueueEmpty(Q)：若队列 Q 为空，返回 true，否则返回 false。
  GetHead(Q,*e)：若队列 Q 存在且非空，用 e 返回队列 Q 的队头元素。
  EnQueue(*Q,e)：若队列 Q 存在，插入新元素 e 到队列 Q 中并成为队尾元素。
  DeQueue(*Q,*e)：删除队列 Q 中队头元素，并用 e 返回其值。
  QueueLength(Q)：返回队列 Q 的元素个数
endADT
```

#### 循环队列的顺序存储结构

```c
typedef int QElemType; /* QElemType 类型根据实际情况而定，这里假设为 int */
/* 循环队列的顺序存储结构 */
typedef struct
{
  QElemType data[MAXSIZE];
  int front;       /* 头指针 */
  int rear;        /* 尾指针，若队列不空，指向队列尾元素的下一个位置 */
}SqQueue;

/* 初始化一个空队列 Q */
Status InitQueue(SqQueue *Q)
{
  Q->front=0;
  Q->rear=0;
  return  OK;
}

/* 返回 Q 的元素个数，也就是队列的当前长度 */
int QueueLength(SqQueue Q)
{
  return (Q.rear-Q.front+MAXSIZE)%MAXSIZE;
}

/* 循环队列的入队操作 */
/* 若队列未满，则插入元素 e 为 Q 新的队尾元素 */
Status EnQueue(SqQueue *Q, QElemType e)
{
  if((Q->rear+1)%MAXSIZE==Q->front) /* 队列满的判断 */
    return ERROR;
  Q->data[Q->rear]=e; /* 将元素 e 赋值给队尾 */
  Q->rear=(Q->rear+1)%MAXSIZE; /* rear 指针向后移一位置，若到最后则转到数组头部 */
  return OK;
}

/* 循环队列的出队操作 */
/* 若队列不空，则删除 Q 的队头元素，用 e 返回其值 */
Status DeQueue(SqQueue *Q, QElemType *e)
{
  if(Q->front==Q->rear) /* 队列空的判断 */
    return ERROR;
  *e=Q->data[Q->front]; /* 将队头元素赋值给 e */
  Q->front=(Q->front+1)%MAXSIZE; /* front 指针向后移一位置，若到最后则转到数组头部 */
  return OK;
}
```

#### 队列的链式存储结构

```c
typedef int QElemType;  /* QElemType 类型根据实际情况而定，这里假设为 int */
typedef struct QNode    /* 结点结构 */
{
  QElemType data;
  struct QNode *next;
}QNode,*QueuePtr;
typedef struct           /* 队列的链表结构 */
{
  QueuePtr front,rear; /* 队头、队尾指针 */
}LinkQueue;

/* 入队操作 */
/* 插入元素 e 为 Q 新的队尾元素 */
Status EnQueue(LinkQueue *Q, QElemType e)
{
  QueuePtr s=(QueuePtr)malloc(sizeof(QNode));
  if(!s)
    exit(OVERFLOW); /* 存储分配失败 */
  s->data=e;
  s->next=NULL;
  Q->rear->next=s; /* 把拥有元素 e 的新结点 s 赋值给原队尾结点的 next 域 */
  Q->rear=s;       /* 将当前的 s 赋值给队尾指针，使其成为新的队尾结点 */
  return OK;
}

/* 出队操作 */
/* 若队列不空，则删除 Q 的队头元素，用 e 返回其值 */
Status DeQueue(LinkQueue *Q, QElemType *e)
{
  QueuePtr p;
  if(Q->front==Q->rear)
    return ERROR;
  p=Q->front->next; /* 将欲删除的队头结点暂存给 p */
  *e=p->data; /* 将欲删除的队头结点的值赋值给 e */
  Q->front->next=p->next; /* 将原队头结点后继 p->next 赋值给头结点后继 */
  if(Q->rear==p) /* 若队头是队尾，则删除后将 rear 指向头结点 */
    Q->rear=Q->front;
  free(p);
  return OK;
}
```

## 串
