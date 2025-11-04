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
#include <stdio.h>
#include <stdlib.h>

#define MAXSIZE 20        /* 存储空间初始分配量 */
typedef int ElemType;     /* ElemType 类型根据实际情况而定，这里假设为 int */

/* 顺序表存储结构 */
typedef struct {
  ElemType data[MAXSIZE];  /* 数组存储数据元素，最大长度为 MAXSIZE */
  int length;              /* 线性表当前长度 */
} SqList;

/* 状态码定义 */
#define OK 1
#define ERROR 0
#define TRUE 1
#define FALSE 0
typedef int Status;        /* Status是函数类型，值为结果状态代码（如 OK/ERROR） */

/* ================ 基本操作函数 ================ */

/* 1. 获取元素操作 */
/* 初始条件：顺序线性表 L 已存在，1 ≤ i ≤ ListLength(L) */
/* 操作结果：用 e 返回 L 中第 i 个数据元素的值 */
Status GetElem(SqList L, int i, ElemType *e) {
  if (i < 1 || i > L.length) {  /* 检查 i 的范围是否有效 */
    return ERROR;
  }
  *e = L.data[i - 1];  /* 数组下标从 0 开始，第 i 个元素对应 data[i-1] */
  return OK;
}

/* 2. 插入操作 */
/* 初始条件：顺序线性表 L 已存在，1 ≤ i ≤ ListLength(L)+1 */
/* 操作结果：在 L 中第 i 个位置前插入新元素e，L 的长度 +1 */
Status ListInsert(SqList *L, int i, ElemType e) {
  int k;

  /* 检查顺序表是否已满 */
  if (L->length >= MAXSIZE) {
    return ERROR;
  }

  /* 检查插入位置是否合法（允许在表尾插入） */
  if (i < 1 || i > L->length + 1) {
    return ERROR;
  }

  /* 若插入位置不在表尾，需移动元素 */
  if (i <= L->length) {
    for (k = L->length - 1; k >= i - 1; k--) {
      L->data[k + 1] = L->data[k];  /* 向后移动元素 */
    }
  }

  L->data[i - 1] = e;  /* 插入新元素 */
  L->length++;         /* 表长 +1 */
  return OK;
}

/* 3. 删除操作 */
/* 初始条件：顺序线性表 L 已存在，1 ≤ i ≤ ListLength(L) */
/* 操作结果：删除 L中第 i 个位置的元素，并用 e 返回其值，L 的长度-1 */
Status ListDelete(SqList *L, int i, ElemType *e) {
  int k;

  /* 检查表是否为空 */
  if (L->length == 0) {
    return ERROR;
  }

  /* 检查删除位置是否合法 */
  if (i < 1 || i > L->length) {
    return ERROR;
  }

  *e = L->data[i - 1];  /* 保存被删除元素的值 */

  /* 若删除的不是最后位置，需前移元素 */
  if (i < L->length) {
    for (k = i; k < L->length; k++) {
      L->data[k - 1] = L->data[k];  /* 向前移动元素 */
    }
  }

  L->length--;  /* 表长 -1 */
  return OK;
}

/* ================ 测试代码 ================ */
int main() {
  SqList L = {{1, 2, 3, 4, 5}, 5};  /* 初始化顺序表 */
  ElemType e;
  Status status;

  /* 测试 GetElem */
  status = GetElem(L, 3, &e);
  if (status == OK) {
    printf("第3个元素是: %d\n", e);
  } else {
    printf("获取元素失败\n");
  }

  /* 测试 ListInsert */
  status = ListInsert(&L, 3, 99);
  if (status == OK) {
    printf("插入成功，新长度: %d\n", L.length);
  } else {
    printf("插入失败\n");
  }

  /* 测试 ListDelete */
  status = ListDelete(&L, 2, &e);
  if (status == OK) {
    printf("删除的元素是: %d，新长度: %d\n", e, L.length);
  } else {
    printf("删除失败\n");
  }

  return 0;
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
typedef struct Node {
  ElemType data;       /* 数据域，存储数据元素 */
  struct Node *next;   /* 指针域，指向下一个结点 */
} Node;

/* 定义 LinkList 为指向 Node 结构体的指针类型 */
typedef struct Node *LinkList;
```

获取链表第 i 个数据的算法思路：

1. 声明一个结点 p 指向链表第一个结点，初始化 j 从 1 开始
2. 当 j < i 时，就遍历链表，让 p 的指针向后移动，不断指向下一结点，j 累加 1
3. 若到链表末尾 p 为空，则说明第 i 个元素不存在
4. 否则查找成功，返回结点 p 的数据

```c
/* 初始条件：顺序线性表 L 已存在（带头结点），1 ≤ i ≤ ListLength(L) */
/* 操作结果：用 e 返回 L 中第 i 个数据元素的值 */
Status GetElem(LinkList L, int i, ElemType *e) {
  int j;
  LinkList p;

  // 检查链表是否存在或是否为空表（仅头结点）
  if (L == NULL || L->next == NULL) {
    return ERROR;
  }

  p = L->next;  // p 指向第一个数据结点（跳过头结点）
  j = 1;        // 计数器初始化为 1（第一个数据结点）

  // 遍历查找第 i 个结点
  while (p != NULL && j < i) {
    p = p->next;
    ++j;
  }

  // 检查第 i 个结点是否存在
  if (p == NULL || j > i) {
    return ERROR;  // 第 i 个结点不存在
  }

  *e = p->data;  // 返回结点数据
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
/* 初始条件：顺序线性表 L 已存在（带头结点），1 ≤ i ≤ ListLength(L)+1 */
/* 操作结果：在 L 的第 i 个位置之前插入新的数据元素 e，L 的长度加 1 */
Status ListInsert(LinkList *L, int i, ElemType e) {
  int j;
  LinkList p, s;

  // 检查链表是否存在
  if (L == NULL || *L == NULL) {
    return ERROR;
  }

  p = *L;  // p 指向头结点
  j = 0;   // 头结点是第 0 个结点（不存储数据）

  // 遍历寻找第 i-1 个结点（即插入位置的前驱）
  while (p != NULL && j < i - 1) {
    p = p->next;
    ++j;
  }

  // 检查插入位置是否合法
  if (p == NULL || j > i - 1) {
    return ERROR;  // 第 i 个位置不存在（超出链表长度）
  }

  // 创建新结点并插入
  s = (LinkList)malloc(sizeof(Node));
  if (s == NULL) {
    return ERROR;  // 内存分配失败
  }
  s->data = e;
  s->next = p->next;  // 新结点指向原第 i 个结点
  p->next = s;        // 前驱结点指向新结点

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
/* 初始条件：顺序线性表 L 已存在（带头结点），1 ≤ i ≤ ListLength(L) */
/* 操作结果：删除 L 的第 i 个数据元素，并用 e 返回其值，L 的长度减 1 */
Status ListDelete(LinkList *L, int i, ElemType *e) {
  int j;
  LinkList p, q;

  // 检查链表是否存在
  if (L == NULL || *L == NULL) {
    return ERROR;
  }

  p = *L;  // p 指向头结点
  j = 0;   // 头结点是第 0 个结点（不存储数据）

  // 遍历寻找第 i-1 个结点（即待删除结点的前驱）
  while (p->next != NULL && j < i - 1) {
    p = p->next;
    ++j;
  }

  // 检查第 i 个结点是否存在
  if (!(p->next) || j > i - 1) {
    return ERROR;  // 第 i 个结点不存在
  }

  q = p->next;        // q 指向待删除结点
  p->next = q->next;  // 跳过 q 结点
  *e = q->data;       // 保存待删除结点的数据
  free(q);            // 释放内存

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
#include <stdlib.h>
#include <time.h>

/* 随机产生 n 个元素的值，建立带表头结点的单链线性表 L（头插法） */
/* 新结点总是插入在头结点之后，最终链表顺序与输入顺序相反 */
void CreateListHead(LinkList *L, int n) {
  LinkList p;
  int i;

  srand(time(0));                     /* 初始化随机数种子 */
  *L = (LinkList)malloc(sizeof(LNode)); /* 创建头结点 */
  if (*L == NULL) {
    return; /* 内存分配失败 */
  }
  (*L)->next = NULL;                  /* 初始化为空链表 */

  for (i = 0; i < n; i++) {
    p = (LinkList)malloc(sizeof(LNode)); /* 生成新结点 */
    if (p == NULL) {
      return; /* 内存分配失败 */
    }
    p->data = rand() % 100 + 1;       /* 随机生成 1~100 的数字 */
    p->next = (*L)->next;             /* 新结点指向原第一个结点 */
    (*L)->next = p;                   /* 头结点指向新结点 */
  }
}

/* 随机产生 n 个元素的值，建立带表头结点的单链线性表 L（尾插法） */
/* 新结点总是插入在链表尾部，最终链表顺序与输入顺序一致 */
void CreateListTail(LinkList *L, int n) {
  LinkList p, r;
  int i;

  srand(time(0));                     /* 初始化随机数种子 */
  *L = (LinkList)malloc(sizeof(LNode)); /* 创建头结点 */
  if (*L == NULL) {
    return; /* 内存分配失败 */
  }
  r = *L;                             /* r 指向尾结点，初始为头结点 */

  for (i = 0; i < n; i++) {
    p = (LinkList)malloc(sizeof(LNode)); /* 生成新结点 */
    if (p == NULL) {
      return; /* 内存分配失败 */
    }
    p->data = rand() % 100 + 1;       /* 随机生成 1~100 的数字 */
    r->next = p;                      /* 尾结点指向新结点 */
    r = p;                            /* 更新尾结点为新结点 */
  }
  r->next = NULL;                     /* 终止链表 */
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
/* 初始条件：顺序线性表 L 已存在（带头结点） */
/* 操作结果：将 L 重置为空表（仅保留头结点） */
Status ClearList(LinkList *L) {
  LinkList p, q;

  if (L == NULL || *L == NULL) {  /* 检查链表是否存在 */
    return ERROR;
  }

  p = (*L)->next;  /* p 指向第一个数据结点 */
  while (p != NULL) {  /* 遍历链表 */
    q = p->next;  /* 保存下一个结点的地址 */
    free(p);      /* 释放当前结点 */
    p = q;        /* 移动到下一个结点 */
  }

  (*L)->next = NULL;  /* 头结点指针域置空 */
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
/* 双向链表结点结构 */
typedef struct DulNode {
  ElemType data;               /* 数据域 */
  struct DulNode *prior;       /* 直接前驱指针 */
  struct DulNode *next;        /* 直接后继指针 */
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
typedef int SElemType; /* SElemType 类型根据实际情况而定，这里假设为 int */

typedef struct {
  SElemType data[MAXSIZE];  /* 存储栈元素的数组 */
  int top;                  /* 栈顶指针（初始为 -1 表示空栈） */
} SqStack;

/* 进栈操作 */
/* 插入元素 e 为新的栈顶元素 */
Status Push(SqStack *S, SElemType e) {
  if (S->top == MAXSIZE - 1) {  /* 栈满判断 */
    return ERROR;
  }
  S->data[++S->top] = e;        /* 栈顶指针先 +1，再赋值 */
  return OK;
}

/* 出栈操作 */
/* 若栈不空，则删除 S 的栈顶元素，用 e 返回其值，并返回 OK；否则返回 ERROR */
Status Pop(SqStack *S, SElemType *e) {
  if (S->top == -1) {           /* 栈空判断 */
    return ERROR;
  }
  *e = S->data[S->top--];       /* 先取值，再栈顶指针 -1 */
  return OK;
}
```

#### 两栈共享空间

```c
/* 两栈共享空间结构 */
typedef struct {
  SElemType data[MAXSIZE];  /* 存储栈元素的数组 */
  int top1;                /* 栈1的栈顶指针（初始为-1） */
  int top2;                /* 栈2的栈顶指针（初始为MAXSIZE） */
} SqDoubleStack;

/* 插入元素 e 为新的栈顶元素 */
/* stackNumber 表示栈号（1 或 2） */
Status Push(SqDoubleStack *S, SElemType e, int stackNumber) {
  /* 栈满判断：top1 + 1 == top2 时，共享空间已满 */
  if (S->top1 + 1 == S->top2)
    return ERROR;

  if (stackNumber == 1) {
    /* 栈1进栈：top1先+1，再赋值 */
    S->data[++S->top1] = e;
  } else if (stackNumber == 2) {
    /* 栈2进栈：top2先-1，再赋值 */
    S->data[--S->top2] = e;
  }
  return OK;
}

/* 出栈操作 */
/* 若栈不空，则删除栈顶元素并用 e 返回其值，返回 OK；否则返回 ERROR */
Status Pop(SqDoubleStack *S, SElemType *e, int stackNumber) {
  if (stackNumber == 1) {
    /* 栈1空判断 */
    if (S->top1 == -1)
      return ERROR;
    /* 栈1出栈：先取值，再top1-- */
    *e = S->data[S->top1--];
  } else if (stackNumber == 2) {
    /* 栈2空判断 */
    if (S->top2 == MAXSIZE)
      return ERROR;
    /* 栈2出栈：先取值，再top2++ */
    *e = S->data[S->top2++];
  }
  return OK;
}
```

#### 栈的链式存储结构

```c
typedef struct StackNode {
  SElemType data;
  struct StackNode *next;
} StackNode, *LinkStackPtr;

typedef struct LinkStack {
  LinkStackPtr top;  /* 栈顶指针 */
  int count;         /* 栈元素计数器 */
} LinkStack;

/* 进栈操作 */
/* 插入元素 e 为新的栈顶元素 */
Status Push(LinkStack *S, SElemType e) {
  LinkStackPtr s = (LinkStackPtr)malloc(sizeof(StackNode));
  if (!s)
    exit(OVERFLOW);  /* 存储分配失败 */

  s->data = e;       /* 将新元素赋值给新结点的数据域 */
  s->next = S->top;  /* 将当前栈顶结点赋值给新结点的后继 */
  S->top = s;        /* 更新栈顶指针指向新结点 */
  S->count++;        /* 栈元素计数器 +1 */
  return OK;
}

/* 出栈操作 */
/* 若栈不空，则删除 S 的栈顶元素，用 e 返回其值，并返回 OK；否则返回 ERROR */
Status Pop(LinkStack *S, SElemType *e) {
  LinkStackPtr p;

  if (StackEmpty(*S))  /* 栈空判断 */
    return ERROR;

  *e = S->top->data;   /* 保存栈顶元素的值 */
  p = S->top;          /* 临时保存栈顶结点 */
  S->top = S->top->next; /* 栈顶指针下移，指向新的栈顶结点 */
  free(p);             /* 释放原栈顶结点 */
  S->count--;          /* 栈元素计数器 -1 */
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
typedef int QElemType;  /* QElemType类型根据实际情况而定，这里假设为int */

/* 循环队列的顺序存储结构 */
typedef struct {
  QElemType data[MAXSIZE];
  int front;  /* 头指针，若队列不空，指向队头元素 */
  int rear;   /* 尾指针，若队列不空，指向队尾元素的下一个位置 */
} SqQueue;

/* 初始化一个空队列Q */
Status InitQueue(SqQueue *Q) {
  Q->front = 0;
  Q->rear = 0;
  return OK;
}

/* 返回Q的元素个数（队列当前长度） */
int QueueLength(SqQueue Q) {
  return (Q.rear - Q.front + MAXSIZE) % MAXSIZE;
}

/* 循环队列的入队操作 */
/* 若队列未满，则插入元素e为Q新的队尾元素 */
Status EnQueue(SqQueue *Q, QElemType e) {
  /* 队列满的判断 */
  if ((Q->rear + 1) % MAXSIZE == Q->front)
    return ERROR;

  Q->data[Q->rear] = e;  /* 将元素e放入队尾位置 */
  /* rear指针向后移一位，若到数组末尾则转到头部 */
  Q->rear = (Q->rear + 1) % MAXSIZE;
  return OK;
}

/* 循环队列的出队操作 */
/* 若队列不空，则删除Q的队头元素，用e返回其值 */
Status DeQueue(SqQueue *Q, QElemType *e) {
  /* 队列空的判断 */
  if (Q->front == Q->rear)
    return ERROR;

  *e = Q->data[Q->front];  /* 保存队头元素值 */
  /* front指针向后移一位，若到数组末尾则转到头部 */
  Q->front = (Q->front + 1) % MAXSIZE;
  return OK;
}
```

#### 队列的链式存储结构

```c
typedef int QElemType;  /* QElemType 类型根据实际情况而定，这里假设为 int */

typedef struct QNode {  /* 结点结构 */
  QElemType data;
  struct QNode *next;
} QNode, *QueuePtr;

typedef struct {        /* 队列的链表结构 */
  QueuePtr front, rear; /* 队头、队尾指针 */
} LinkQueue;

/* 入队操作 */
/* 插入元素 e 为 Q 新的队尾元素 */
Status EnQueue(LinkQueue *Q, QElemType e) {
  QueuePtr s = (QueuePtr)malloc(sizeof(QNode));
  if (!s)
    exit(OVERFLOW);  /* 存储分配失败 */

  s->data = e;
  s->next = NULL;
  Q->rear->next = s;  /* 把拥有元素 e 的新结点 s 赋值给原队尾结点的 next 域 */
  Q->rear = s;        /* 将当前的 s 设置为新的队尾结点 */
  return OK;
}

/* 出队操作 */
/* 若队列不空，则删除 Q 的队头元素，用 e 返回其值 */
Status DeQueue(LinkQueue *Q, QElemType *e) {
  QueuePtr p;

  if (Q->front == Q->rear)
    return ERROR;  /* 队列为空 */

  p = Q->front->next;       /* 将欲删除的队头结点暂存给 p */
  *e = p->data;             /* 保存队头结点的值 */
  Q->front->next = p->next; /* 修改头结点的后继指针 */

  if (Q->rear == p)         /* 若删除的是最后一个结点 */
    Q->rear = Q->front;     /* 重置队尾指针指向头结点 */

  free(p);                  /* 释放结点空间 */
  return OK;
}
```

## 串

串（string）是由零个或多个字符组成的有限序列，又名叫字符串

```c
ADT 串（string）

Data
  串中元素仅由一个字符组成，相邻元素具有前驱和后继关系。

Operation
  StrAssign(T, *chars): 生成一个其值等于字符串常量 chars 的串 T。
  StrCopy(T, S): 串 S 存在，由串 S 复制得串 T。
  ClearString(S): 串 S 存在，将串清空。
  StringEmpty(S): 若串 S 为空，返回 true，否则返回 false。
  StrLength(S): 返回串 S 的元素个数，即串的长度。
  StrCompare(S, T): 若 S>T，返回值>0，若 S=T，返回 0，若 S<T，返回值<0。
  Concat(T, S1, S2): 用 T 返回由 S1 和 S2 联接而成的新串。
  SubString(Sub, S, pos, len): 串 S 存在，1≤pos≤StrLength(S)，且 0≤len≤StrLength(S)-pos+1，用 Sub 返回串 S 的第 pos 个字符起长度为 len 的子串。
  Index(S, T, pos): 串 S 和 T 存在，T 是非空串，1≤pos≤StrLength(S)。若主串 S 中存在和串 T 值相同的子串，则返回它在主串 S 中第 pos 个字符之后第一次出现的位置，否则返回 0。
  Replace(S, T, V): 串 S、T 和 V 存在，T 是非空串。用 V 替换主串 S 中出现的所有与 T 相等的不重叠的子串。
  StrInsert(S, pos, T): 串 S 和 T 存在，1≤pos≤StrLength(S)+1。在串 S 的第 pos 个字符之前插入串 T。
  StrDelete(S, pos, len): 串 S 存在，1≤pos≤StrLength(S)-len+1。从串 S 中删除第 pos 个字符起长度为 len 的子串。

endADT

/* T 为非空串。若主串 S 中第 pos 个字符之后存在与 T 相等的子串， */
/* 则返回第一个这样的子串在 S 中的位置，否则返回 0 */
int Index(String S, String T, int pos)
{
  int n, m, i;
  String sub;
  if (pos > 0)
  {
    n = StrLength(S);       /* 得到主串 S 的长度 */
    m = StrLength(T);       /* 得到子串 T 的长度 */
    i = pos;
    while (i <= n - m + 1)
    {
      SubString(sub, S, i, m); /* 取主串第 i 个位置， */
                               /* 长度与 T 相等子串给 sub */
      if (StrCompare(sub, T) != 0)  /* 如果两串不相等 */
        ++i;
      else                         /* 如果两串相等 */
        return i;                  /* 则返回 i 值 */
    }
  }
  return 0;  /* 若无子串与 T 相等，返回 0 */
}

/* 返回子串 T 在主串 S 中第 pos 个字符之后的位置。若不存在，则函数返回值为 0。 */
/* T 非空，1 ≤ pos ≤ StrLength(S)。 */
int Index(String S, String T, int pos)
{
  int i = pos;  /* i 用于主串 S 中当前位置下标，若 pos 不为 1 */
                /* 则从 pos 位置开始匹配 */
  int j = 1;    /* j 用于子串 T 中当前位置下标值 */

  while (i <= S[0] && j <= T[0])  /* 若 i 小于 S 长度且 j 小于 T 的长度时循环 */
  {
    if (S[i] == T[j])  /* 两字母相等则继续 */
    {
      ++i;
      ++j;
    }
    else  /* 指针后退重新开始匹配 */
    {
      i = i - j + 2;   /* i 退回到上次匹配首位的下一位 */
      j = 1;           /* j 退回到子串 T 的首位 */
    }
  }

  if (j > T[0])
    return i - T[0];
  else
    return 0;
}
```

[KMP 算法](https://www.bilibili.com/video/BV1PD4y1o7nd)

## 树

树（Tree）是 n（n≥0）个结点的有限集。n=0 时称为空树。在任意一棵非空树中：​（1）有且仅有一个特定的称为根（Root）的结点；​（2）当 n ＞ 1 时，其余结点可分为 m（m ＞ 0）个互不相交的有限集 T~1~、T~2~、……、T~m~，其中每一个集合本身又是一棵树，并且称为根的子树（SubTree）。

树的结点包含一个数据元素及若干指向其子树的分支。结点拥有的子树数称为结点的度（Degree）​。度为 0 的结点称为叶结点（Leaf）或终端结点；度不为 0 的结点称为非终端结点或分支结点。除根结点之外，分支结点也称为内部结点。树的度是树内各结点的度的最大值。

结点的子树的根称为该结点的孩子（Child）​，相应地，该结点称为孩子的双亲（Parent）。同一个双亲的孩子之间互称兄弟（Sibling）​。结点的祖先是从根到该结点所经分支上的所有结点。反之，以某结点为根的子树中的任一结点都称为该结点的子孙。

树中结点的最大层次称为树的深度（Depth）或高度。

如果将树中结点的各子树看成从左至右是有次序的，不能互换的，则称该树为有序树，否则称为无序树。

森林（Forest）是 m（m≥0）棵互不相交的树的集合。

```c
ADT 树(tree)

Data
  树是由一个根结点和若干棵子树构成。树中结点具有相同数据类型及层次关系。

Operation
  InitTree(*T): 构造空树 T。
  DestroyTree(*T): 销毁树 T。
  CreateTree(*T, definition): 按 definition 中给出树的定义来构造树。
  ClearTree(*T): 若树 T 存在，则将树 T 清为空树。
  TreeEmpty(T): 若 T 为空树，返回 true，否则返回 false。
  TreeDepth(T): 返回 T 的深度。
  Root(T): 返回 T 的根结点。
  Value(T, cur_e): cur_e 是树 T 中一个结点，返回此结点的值。
  Assign(T, cur_e, value): 给树 T 的结点 cur_e 赋值为 value。
  Parent(T, cur_e): 若 cur_e 是树 T 的非根结点，则返回它的双亲，否则返回空。
  LeftChild(T, cur_e): 若 cur_e 是树 T 的非叶结点，则返回它的最左孩子，否则返回空。
  RightSibling(T, cur_e): 若 cur_e 有右兄弟，则返回它的右兄弟，否则返回空。
  InsertChild(*T, *p, i, c): 其中 p 指向树 T 的某个结点，i 为所指结点 p 的度加上 1，
    非空树 c 与 T 不相交，操作结果为插入 c 为树 T 中 p 指结点的第 i 棵子树。
  DeleteChild(*T, *p, i): 其中 p 指向树 T 的某个结点，i 为所指结点 p 的度，操作
    结果为删除 T 中 p 所指结点的第 i 棵子树。

endADT
```

### 树的存储结构

#### 双亲表示法

```c
/* 树的双亲表示法结点结构定义 */
#define MAX_TREE_SIZE 100
typedef int TElemType;  /* 树结点的数据类型，目前暂定为整型 */

typedef struct PTNode   /* 结点结构 */
{
  TElemType data;       /* 结点数据 */
  int parent;           /* 双亲位置 */
} PTNode;

typedef struct          /* 树结构 */
{
  PTNode nodes[MAX_TREE_SIZE];  /* 结点数组 */
  int r, n;             /* 根的位置和结点数 */
} PTree;
```
