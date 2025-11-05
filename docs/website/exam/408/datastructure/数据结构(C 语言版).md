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

**静态分配**

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

**动态分配**

```c
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#define SIZE 5

typedef struct Table {
  int *head;  // 声明了一个名为head的长度不确定的数组，也叫“动态数组”
  int length; // 记录当前顺序表的长度
} TABLE, *PTABLE;

// 初始化
void initTable(PTABLE t);
// 遍历
void displayTable(PTABLE t);
// 插入函数，其中，elem为插入的元素，add为插入到顺序表的位置
void addTable(PTABLE t, int elem, int add);
// 删除指定位置
void delTable(PTABLE t, int add);
// 查找函数，其中，elem表示要查找的数据元素的值
int searchTable(PTABLE t, int elem);
// 销毁
void destoryList(PTABLE t);
// 清空
void ClearList(PTABLE t);
// 判断是否空
int ListEmpty(PTABLE t);
// 获取长度
int GetLen(PTABLE t);

int main() {
  TABLE t;
  initTable(&t);
  for (int i = 0; i < SIZE; i++) {
    t.head[i] = i + 1;
    t.length++;
  }

  addTable(&t, 8, 5);
  printf("顺序表中存储的元素分别是：\n");
  displayTable(&t);
  printf("\n删除后：\n");
  delTable(&t, 5);
  displayTable(&t);
  int ret = searchTable(&t, 4);
  printf("\n查找结果为:%d", ret);
  return 0;
}

// 初始化
void initTable(PTABLE t) {
  t->head = (int *)malloc(sizeof(int) * SIZE);
  // 如果申请失败，作出提示并直接退出程序
  if (t->head == NULL) {
    printf("初始化失败");
    exit(0);
  }
  t->length = 0; // 空表的长度初始化为0
}

// 遍历
void displayTable(PTABLE t) {
  for (int i = 0; i < t->length; i++) {
    printf("%d ", t->head[i]);
  }
}

// 插入函数，其中，elem为插入的元素，add为插入到顺序表的位置
void addTable(PTABLE t, int elem, int add) {
  // 判断插入本身是否存在问题（如果插入位置比整张表的长度+1还大（如果相等，是尾随的情况），或者插入的位置本身不存在，程序作为提示并自动退出）
  if (add > t->length + 1 || add < 1) {
    printf("插入位置有问题");
    exit(0);
  }
  // 插入操作，需要将从插入位置开始的后续元素，逐个后移
  for (int i = t->length - 1; i >= add - 1; i--) {
    t->head[i + 1] = t->head[i];
  }
  // 后移完成后，直接将所需插入元素，添加到顺序表的相应位置
  t->head[add - 1] = elem;
  // 由于添加了元素，所以长度+1
  t->length++;
}

// 删除指定位置
void delTable(PTABLE t, int add) {
  if (add > t->length || add < 1) {
    printf("被删除元素的位置有误");
    exit(0);
  }
  // 需要用后面的把要删除的位置覆盖
  for (int i = add; i < t->length; i++) {
    t->head[i - 1] = t->head[i];
  }
  t->length--;
}

// 查找函数，其中，elem表示要查找的数据元素的值
int searchTable(PTABLE t, int elem) {
  for (int i = 0; i < t->length; i++) {
    if (t->head[i] == elem) {
      return i + 1;
    }
  }
  return -1;
}

// 销毁
void destoryList(PTABLE t) {
  if (t->head != NULL) {
    free(t->head);
  }
  t->head = NULL;
  printf("释放动态数组内存\n");
}

// 清空
void ClearList(PTABLE t) {
  t->length = 0; // 将顺序表的长度置为 0
}

// 顺序表判空
int ListEmpty(PTABLE t) {
  if (t->length == 0) {
    return 1;
  } else {
    return -1;
  }
}

// 获取顺序表的长度
int GetLen(PTABLE t) {
  return t->length;
}
```

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

#### 孩子表示法

每个结点有多个指针域，其中每个指针指向一棵子树的根结点，我们把这种方法叫做多重链表表示法。

把每个结点的孩子结点排列起来，以单链表作存储结构，则 n 个结点有 n 个孩子链表，如果是叶子结点则此单链表为空。然后 n 个头指针又组成一个线性表，采用顺序存储结构，存放进一个一维数组中。

```c
/* 树的孩子表示法结构定义 */
#define MAX_TREE_SIZE 100

typedef struct CTNode /* 孩子结点 */
{
  int child;
  struct CTNode *next;
} *ChildPtr;

typedef struct /* 表头结构 */
{
  TElemType data;
  ChildPtr firstchild;
} CTBox;

typedef struct /* 树结构 */
{
  CTBox nodes[MAX_TREE_SIZE]; /* 结点数组 */
  int r, n;                  /* 根的位置和结点数 */
} CTree;
```

#### 孩子兄弟表示法

任意一棵树，它的结点的第一个孩子如果存在就是唯一的，它的右兄弟如果存在也是唯一的。因此，我们设置两个指针，分别指向该结点的第一个孩子和此结点的右兄弟。

```c
/* 树的孩子兄弟表示法结构定义 */
typedef struct CSNode
{
  TElemType data;
  struct CSNode *firstchild, *rightsib;
} CSNode, *CSTree;
```

### 二叉树

二叉树（Binary Tree）是 n（n≥0）个结点的有限集合，该集合或者为空集（称为空二叉树）​，或者由一个根结点和两棵互不相交的、分别称为根结点的左子树和右子树的二叉树组成。

二叉树的特点有：

■ 　每个结点最多有两棵子树，所以二叉树中不存在度大于 2 的结点。注意不是只有两棵子树，而是最多有。没有子树或者有一棵子树都是可以的。
■ 　左子树和右子树是有顺序的，次序不能任意颠倒。
■ 　即使树中某结点只有一棵子树，也要区分它是左子树还是右子树。

二叉树具有五种基本形态：

1. 空二叉树。
2. 只有一个根结点。
3. 根结点只有左子树。
4. 根结点只有右子树。
5. 根结点既有左子树又有右子树。

**特殊二叉树**

所有的结点都只有左子树的二叉树叫左斜树。所有结点都是只有右子树的二叉树叫右斜树。这两者统称为**斜树**。

在一棵二叉树中，如果所有分支结点都存在左子树和右子树，并且所有叶子都在同一层上，这样的二叉树称为**满二叉树**。

对一棵具有 n 个结点的二叉树按层序编号，如果编号为 i（1≤i≤n）的结点与同样深度的满二叉树中编号为 i 的结点在二叉树中位置完全相同，则这棵二叉树称为**完全二叉树**。

完全二叉树的特点：

（1）叶子结点只能出现在最下两层。<br />
（2）最下层的叶子一定集中在左部连续位置。<br />
（3）倒数二层，若有叶子结点，一定都在右部连续位置。<br />
（4）如果结点度为 1，则该结点只有左孩子，即不存在只有右子树的情况。<br />
（5）同样结点数的二叉树，完全二叉树的深度最小。

**二叉树的性质**

性质 1：在二叉树的第 i 层上至多有 2^i－1^ 个结点（i≥1）​。

性质 2：深度为 k 的二叉树至多有 2^k^-1 个结点（k≥1）​。

性质 3：对任何一棵二叉树 T，如果其终端结点数为 n~0~，度为 2 的结点数为 n~2~，则 n~0~=n~2~+1。

性质 4：具有 n 个结点的完全二叉树的深度为⌊log~2~n⌋+1（⌊x⌋表示不大于 x 的最大整数）​。

性质 5：如果对一棵有 n 个结点的完全二叉树（其深度为⌊log~2~n⌋+1）的结点按层序编号（从第 1 层到第⌊log~2~n⌋+1 层，每层从左到右）​，对任一结点 i（1≤i≤n）有：

1. 如果 i=1，则结点 i 是二叉树的根，无双亲；如果 i>1，则其双亲是结点⌊i/2⌋。
2. 如果 2i>n，则结点 i 无左孩子（结点 i 为叶子结点）​；否则其左孩子是结点 2i。
3. 如果 2i+1>n，则结点 i 无右孩子；否则其右孩子是结点 2i+1。

二叉树每个结点最多有两个孩子，所以为它设计一个数据域和两个指针域是比较自然的想法，我们称这样的链表叫做二叉链表。

```c
/* 二叉树的二叉链表结点结构定义 */
// 二叉树结点结构体定义
typedef struct BiTNode {
  TElemType data;               // 结点数据
  struct BiTNode *lchild, *rchild; // 左右孩子指针
} BiTNode, *BiTree;

// 创建二叉树（先序遍历顺序，'#'表示空结点）
void createBTree(BiTree *T) {
  char ch;
  scanf("%c", &ch);
  if (ch == '#') {
    *T = NULL;
  } else {
    *T = (BiTree)malloc(sizeof(BiTNode));
    if (!(*T)) {
      return;
    }
    (*T)->data = ch;            // 生成根结点
    createBTree(&(*T)->lchild); // 构造左子树
    createBTree(&(*T)->rchild); // 构造右子树
  }
}

// 计算二叉树的深度
int Depth(BiTree T) {
  if (T == NULL) {
    return 0;
  } else {
    int m = Depth(T->lchild);
    int n = Depth(T->rchild);
    return (m > n ? m : n) + 1; // 返回左右子树深度的较大值+1
  }
}

// 计算叶子结点的个数
int count(BiTree T) {
  if (T == NULL) {
    return 0;
  }
  if ((!T->lchild) && (!T->rchild)) {
    return 1; // 当前结点是叶子结点
  }
  return count(T->lchild) + count(T->rchild); // 返回左右子树叶子结点数之和
}
```

二叉树的遍历（traversing binary tree）是指从根结点出发，按照某种次序依次访问二叉树中所有结点，使得每个结点被访问一次且仅被访问一次。

#### 二叉树的遍历方法

**前序遍历**

规则是若二叉树为空，则空操作返回，否则先访问根结点，然后前序遍历左子树，再前序遍历右子树。

```c
/* 二叉树的前序遍历递归算法 */
void PreOrderTraverse(BiTree T)
{
  if (T == NULL)
    return;
  printf("%c", T->data); /* 显示结点数据，可以更改为其他对结点操作 */
  PreOrderTraverse(T->lchild); /* 再前序遍历左子树 */
  PreOrderTraverse(T->rchild); /* 最后前序遍历右子树 */
}
```

**中序遍历**

规则是若树为空，则空操作返回，否则从根结点开始（注意并不是先访问根结点）​，中序遍历根结点的左子树，然后是访问根结点，最后中序遍历右子树。

```c
/* 二叉树的中序遍历递归算法 */
void InOrderTraverse(BiTree T)
{
  if (T == NULL)
    return;
  InOrderTraverse(T->lchild); /* 中序遍历左子树 */
  printf("%c", T->data);      /* 显示结点数据，可以更改为其他对结点操作 */
  InOrderTraverse(T->rchild); /* 最后中序遍历右子树 */
}
```

**后序遍历**

规则是若树为空，则空操作返回，否则从左到右先叶子后结点的方式遍历访问左右子树，最后是访问根结点。

```c
/* 二叉树的后序遍历递归算法 */
void PostOrderTraverse(BiTree T)
{
  if (T == NULL)
    return;
  PostOrderTraverse(T->lchild); /* 先后序遍历左子树 */
  PostOrderTraverse(T->rchild); /* 再后序遍历右子树 */
  printf("%c", T->data);        /* 显示结点数据，可以更改为其他对结点操作 */
}
```

**层序遍历**

规则是若树为空，则空操作返回，否则从树的第一层，也就是根结点开始访问，从上而下逐层遍历，在同一层中，按从左到右的顺序对结点逐个访问。

■ 　已知前序遍历序列和中序遍历序列，可以唯一确定一棵二叉树。
■ 　已知后序遍历序列和中序遍历序列，可以唯一确定一棵二叉树。

#### 线索二叉树

指向前驱和后继的指针称为线索，加上线索的二叉链表称为线索链表，相应的二叉树就称为线索二叉树（Threaded Binary Tree）。

对二叉树以某种次序遍历使其变为线索二叉树的过程称做是线索化。

<div style="display: flex;border:1px solid #000;width:500px;text-align: center;margin:0 auto">
  <span style="flex:1;border-right:1px solid #000">lchild</span>
  <span style="flex:1;border-right:1px solid #000">ltag</span>
  <span style="flex:1;border-right:1px solid #000">data</span>
  <span style="flex:1;border-right:1px solid #000">rtag</span>
  <span style="flex:1">rchild</span>
</div>

■ 　 ltag 为 0 时指向该结点的左孩子，为 1 时指向该结点的前驱。
■ 　 rtag 为 0 时指向该结点的右孩子，为 1 时指向该结点的后继。

```c
/* 二叉树的二叉线索存储结构定义 */
typedef enum
{
  Link,    /* Link==0 表示指向左右孩子指针 */
  Thread   /* Thread==1 表示指向前驱或后继的线索 */
} PointerTag;

typedef struct BiThrNode  /* 二叉线索存储结点结构 */
{
  TElemType data;         /* 结点数据 */
  struct BiThrNode *lchild, *rchild; /* 左右孩子指针 */
  PointerTag LTag;        /* 左标志 */
  PointerTag RTag;        /* 右标志 */
} BiThrNode, *BiThrTree;
```

线索化的过程就是在遍历的过程中修改空指针的过程。

中序遍历线索化的递归函数代码如下：

```c
BiThrTree pre; /* 全局变量，始终指向刚刚访问过的结点 */

/* 中序遍历进行中序线索化 */
void InThreading(BiThrTree p)
{
  if (p)
  {
    InThreading(p->lchild); /* 递归左子树线索化 */

    if (!p->lchild)         /* 没有左孩子 */
    {
      p->LTag = Thread;     /* 前驱线索 */
      p->lchild = pre;      /* 左孩子指针指向前驱 */
    }

    if (!pre->rchild)       /* 前驱没有右孩子 */
    {
      pre->RTag = Thread;   /* 后继线索 */
      pre->rchild = p;      /* 前驱右孩子指针指向后继（当前结点 p） */
    }

    pre = p;                /* 保持 pre 指向 p 的前驱 */
    InThreading(p->rchild); /* 递归右子树线索化 */
  }
}
```

如果所用的二叉树需经常遍历或查找结点时需要某种遍历序列中的前驱和后继，那么采用线索二叉链表的存储结构就是非常不错的选择。

中序线索化二叉树的中序遍历函数：

```c
/*
 * T 指向头结点，头结点左链 lchild 指向根结点，头结点右链 rchild 指向中序遍历的最后一个结点。
 * 中序遍历二叉线索链表表示的二叉树 T。
 */
Status InOrderTraverse_Thr(BiThrTree T)
{
  BiThrTree p;
  p = T->lchild;  /* p 指向根结点 */

  while (p != T)  /* 空树或遍历结束时，p == T */
  {
    /* 当 LTag == Link 时，循环到中序序列的第一个结点 */
    while (p->LTag == Link)
    {
      p = p->lchild;
    }

    /* 显示结点数据，可以更改为其他对结点操作 */
    printf("%c", p->data);

    /*
     * 当 RTag == Thread 且 rchild 不是指向头结点时，
     * 利用线索找到后继结点
     */
    while (p->RTag == Thread && p->rchild != T)
    {
      p = p->rchild;
      printf("%c", p->data);
    }

    p = p->rchild;  /* p 进至其右子树根（可能是线索或子树） */
  }

  return OK;
}
```

#### 树、森林与二叉树的转换

**树转换为二叉树**

将树转换为二叉树的步骤如下：

1. 加线。在所有兄弟结点之间加一条连线。
2. 去线。对树中每个结点，只保留它与第一个孩子结点的连线，删除它与其他孩子结点之间的连线。
3. 层次调整。以树的根结点为轴心，将整棵树顺时针旋转一定的角度，使之结构层次分明。注意第一个孩子是二叉树结点的左孩子，兄弟转换过来的孩子是结点的右孩子。

**森林转换为二叉树**

森林是由若干棵树组成的，所以完全可以理解为，森林中的每一棵树都是兄弟，可以按照兄弟的处理办法来操作。步骤如下：

1. 把每个树转换为二叉树。
2. 第一棵二叉树不动，从第二棵二叉树开始，依次把后一棵二叉树的根结点作为前一棵二叉树的根结点的右孩子，用线连接起来。当所有的二叉树连接起来后就得到了由森林转换来的二叉树。

**二叉树转换为树**

1. 加线。若某结点的左孩子结点存在，则将这个左孩子的右孩子结点、右孩子的右孩子结点、右孩子的右孩子的右孩子结点……哈，反正就是左孩子的 n 个右孩子结点都作为此结点的孩子。将该结点与这些右孩子结点用线连接起来。
2. 去线。删除原二叉树中所有结点与其右孩子结点的连线。
3. 层次调整。使之结构层次分明。

**二叉树转换为森林**

1. 从根结点开始，若右孩子存在，则把与右孩子结点的连线删除，再查看分离后的二叉树，若右孩子存在，则连线删除……，直到所有右孩子连线都删除为止，得到分离的二叉树。
2. 再将每棵分离后的二叉树转换为树即可。

### 哈夫曼树

**哈夫曼树的构造**

```c
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct {
  int weight;  // 权值
  // 双亲节点的坐标，左孩子坐标，右孩子坐标
  int parent, lch, rch;
} HTNode, *HuffmanTree;

// 创建哈夫曼树 n:初始结点数
void CreateHuffmanTree(HuffmanTree *HT, int n) {
  if (n <= 1) {
    return;
  } else {
    // 总结点数
    int m = 2 * n - 1;
    // 因为不用0下标，所有开辟空间+1
    // HT[m]是根结点
    *HT = (HuffmanTree)malloc(sizeof(HTNode) * (m + 1));
    // 初始化 将2n-1个元素置为0
    for (int i = 1; i <= m; i++) {
      (*HT)[i].weight = 0;
      (*HT)[i].parent = 0;
      (*HT)[i].lch = 0;
      (*HT)[i].rch = 0;
    }
    // 权值赋值
    for (int i = 1; i <= n; i++) {
      scanf("%d", &(*HT)[i].weight);
    }

    // 创建非叶子节点，建哈夫曼树
    for (int i = n + 1; i <= m; i++) {
      // 选出权值最小的两个节点,并返回它们的下标（序号）
      // Select(HT, i-1, s1, s2);
      int s1, s2;
      // 此时的i是当前新创建节点的序号
      (*HT)[s1].parent = i;
      (*HT)[s2].parent = i;
      (*HT)[i].lch = s1;
      (*HT)[i].rch = s2;
      (*HT)[i].weight = (*HT)[s1].weight + (*HT)[s2].weight;
    }
  }
}
```

## 图

图（Graph）是由顶点的有穷非空集合和顶点之间边的集合组成，通常表示为：G（V,E）​，其中，G 表示一个图，V 是图 G 中顶点的集合，E 是图 G 中边的集合。

对于图的定义，我们需要明确几个注意的地方。

■ 　线性表中我们把数据元素叫元素，树中将数据元素叫结点，在图中数据元素，我们则称之为顶点（Vertex）。
■ 　线性表中可以没有数据元素，称为空表。树中可以没有结点，叫做空树。那么对于图呢？在图结构中，不允许没有顶点。在定义中，若 V 是顶点的集合，则强调了顶点集合 V 有穷非空。
■ 　线性表中，相邻的数据元素之间具有线性关系，树结构中，相邻两层的结点具有层次关系，而图中，任意两个顶点之间都可能有关系，顶点之间的逻辑关系用边来表示，边集可以是空的。

无向边：若顶点 v~i~ 到 v~j~ 之间的边没有方向，则称这条边为无向边（Edge）​，用无序偶对（v~i~,v~j~）来表示。如果图中任意两个顶点之间的边都是无向边，则称该图为**无向图**（Undirected graphs）​。

有向边：若从顶点 v~i~ 到 v~j~ 的边有方向，则称这条边为有向边，也称为弧（Arc）​。用有序偶<v~i~, v~j~>来表示，v~i~ 称为弧尾（Tail）​，v~j~ 称为弧头（Head）​。如果图中任意两个顶点之间的边都是有向边，则称该图为**有向图**（Directed graphs）。

在图中，若不存在顶点到其自身的边，且同一条边不重复出现，则称这样的图为**简单图**。

在无向图中，如果任意两个顶点之间都存在边，则称该图为**无向完全图**。含有 n 个顶点的无向完全图有 $\frac{n(n-1)}{2}$ 条边。

在有向图中，如果任意两个顶点之间都存在方向互为相反的两条弧，则称该图为**有向完全图**。含有 n 个顶点的无向完全图有 $n(n-1)$ 条边。

有很少条边或弧的图称为**稀疏图**，反之称为**稠密图**。

有些图的边或弧具有与它相关的数字，这种与图的边或弧相关的数叫做**权**（Weight）。这些权可以表示从一个顶点到另一个顶点的距离或耗费。这种带权的图通常称为网（Network）​。

假设有两个图 G=（V,{E}）和 G’=（V’,{E’}）​，如果 V’⊆V 且 E’⊆E，则称 G’为 G 的子图（Subgraph）。

对于无向图 G=（V,{E}）​，如果边（v,v’）∈E，则称顶点 v 和 v’互为邻接点（Adjacent）​，即 v 和 v’相邻接。边（v,v’）依附（incident）于顶点 v 和 v’，或者说（v,v’）与顶点 v 和 v’相关联。顶点 v 的度（Degree）是和 v 相关联的边的数目，记为 TD（v）。

对于有向图 G=（V,{E}）​，如果弧<v,v’>∈E，则称顶点 v 邻接到顶点 v’，顶点 v’邻接自顶点 v。弧<v,v’>和顶点 v，v’相关联。以顶点 v 为头的弧的数目称为 v 的入度（InDegree）​，记为 ID（v）​；以 v 为尾的弧的数目称为 v 的出度（OutDegree）​，记为 OD（v）​；顶点 v 的度为 TD（v）=ID（v）+OD（v）。

无向图 G=（V,{E}）中从顶点 v 到顶点 v’的路径（Path）是一个顶点序列（v=v~i~,0,v~i~,1,…,v~i~,m=v’）​，其中（v~i~,j-1,v~i~,j）∈E，1≤j≤m。

路径的长度是路径上的边或弧的数目。

第一个顶点到最后一个顶点相同的路径称为回路或环（Cycle）​。序列中顶点不重复出现的路径称为简单路径。除了第一个顶点和最后一个顶点之外，其余顶点不重复出现的回路，称为简单回路或简单环。

在无向图 G 中，如果从顶点 v 到顶点 v’有路径，则称 v 和 v’是连通的。如果对于图中任意两个顶点 vi、vj∈E，vi 和 vj 都是连通的，则称 G 是连通图（Connected Graph）。

无向图中的极大连通子图称为连通分量。注意连通分量的概念，它强调：

■ 　要是子图；
■ 　子图要是连通的；
■ 　连通子图含有极大顶点数；
■ 　具有极大顶点数的连通子图包含依附于这些顶点的所有边。

在有向图 G 中，如果对于每一对 v~i~、v~j~∈V、v~i~≠v~j~，从 v~i~ 到 v~j~ 和从 v~j~ 到 v~i~ 都存在路径，则称 G 是强连通图。有向图中的极大强连通子图称做有向图的强连通分量。

一个连通图的生成树是一个极小的连通子图，它含有图中全部的 n 个顶点，但只有足以构成一棵树的 n－1 条边。

如果一个有向图恰有一个顶点的入度为 0，其余顶点的入度均为 1，则是一棵有向树。

一个有向图的生成森林由若干棵有向树组成，含有图中全部顶点，但只有足以构成若干棵不相交的有向树的弧。

```c
ADT 图（Graph）

Data
  顶点的有穷非空集合和边的集合。

Operation
  CreateGraph(*G, V, VR)：按照顶点集 V 和边弧集 VR 的定义构造图 G。
  DestroyGraph(*G)：图 G 存在则销毁。
  LocateVex(G, u)：若图 G 中存在顶点 u，则返回图中的位置。
  GetVex(G, v)：返回图 G 中顶点 v 的值。
  PutVex(G, v, value)：将图 G 中顶点 v 赋值 value。
  FirstAdjVex(G, *v)：返回顶点 v 的一个邻接顶点，若顶点在 G 中无邻接顶点返回空。
  NextAdjVex(G, v, *w)：返回顶点 v 相对于顶点 w 的下一个邻接顶点，若 w 是 v 的最后一个邻接点则返回“空”。
  InsertVex(*G, v)：在图 G 中增添新顶点 v。
  DeleteVex(*G, v)：删除图 G 中顶点 v 及其相关的弧。
  InsertArc(*G, v, w)：在图 G 中增添弧<v, w>，若 G 是无向图，还需要增添对称弧<w, v>。
  DeleteArc(*G, v, w)：在图 G 中删除弧<v, w>，若 G 是无向图，则还删除对称弧<w, v>。
  DFSTraverse(G)：对图 G 中进行深度优先遍历，在遍历过程对每个顶点调用。
  HFSTraverse(G)：对图 G 中进行广度优先遍历，在遍历过程对每个顶点调用。

endADT
```

### 图的存储结构

#### 邻接矩阵

图的邻接矩阵（Adjacency Matrix）存储方式是用两个数组来表示图。一个一维数组存储图中顶点信息，一个二维数组（称为邻接矩阵）存储图中的边或弧的信息。
