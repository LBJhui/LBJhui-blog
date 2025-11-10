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

```c
typedef char VertexType;       /* 顶点类型应由用户定义 */
typedef int EdgeType;          /* 边上的权值类型应由用户定义 */
#define MAXVEX 100             /* 最大顶点数，应由用户定义 */
#define INFINITY 65535         /* 用65535来代表∞ */

typedef struct {
  VertexType vexs[MAXVEX];     /* 顶点表 */
  EdgeType arc[MAXVEX][MAXVEX];/* 邻接矩阵，可看作边表 */
  int numVertexes, numEdges;   /* 图中当前的顶点数和边数 */
} MGraph;

/* 建立无向网图的邻接矩阵表示 */
void CreateMGraph(MGraph *G)
{
  int i, j, k, w;

  printf("输入顶点数和边数:\n");
  scanf("%d,%d", &G->numVertexes, &G->numEdges); /* 输入顶点数和边数 */

  for (i = 0; i < G->numVertexes; i++)  /* 读入顶点信息，建立顶点表 */
    scanf(&G->vexs[i]);  // **注意：这里应该是字符输入，正确写法应为 `scanf(" %c", &G->vexs[i]);`**

  for (i = 0; i < G->numVertexes; i++)
    for (j = 0; j < G->numVertexes; j++)
      G->arc[i][j] = INFINITY;  /* 邻接矩阵初始化 */

  for (k = 0; k < G->numEdges; k++)  /* 读入 numEdges 条边，建立邻接矩阵 */
  {
    printf("输入边（vi,vj）上的下标 i, 下标 j 和权 w:\n");
    scanf("%d,%d,%d", &i, &j, &w); /* 输入边（vi,vj）上的权 w */

    G->arc[i][j] = w;
    G->arc[j][i] = G->arc[i][j]; /* 因为是无向图，矩阵对称 */
  }
}
```

#### 邻接表

将结点存入数组，并对结点的孩子进行链式存储，把这种数组与链表相结合的存储方法称为邻接表（Adjacency List）。

```c
typedef char VertexType;  /* 顶点类型应由用户定义 */
typedef int EdgeType;     /* 边上的权值类型应由用户定义 */

/* 边表结点 */
typedef struct EdgeNode {
  int adjvex;             /* 邻接点域，存储该顶点对应的下标 */
  EdgeType weight;        /* 用于存储权值，对于非网图可以不需要 */
  struct EdgeNode *next;  /* 链域，指向下一个邻接点 */
} EdgeNode;

/* 顶点表结点 */
typedef struct VertexNode {
  VertexType data;        /* 顶点域，存储顶点信息 */
  EdgeNode *firstedge;    /* 边表头指针 */
} VertexNode, AdjList[MAXVEX];  // 定义邻接表类型

/* 图结构（邻接表表示） */
typedef struct {
  AdjList adjList;        // 邻接表数组
  int numVertexes;        // 图中当前顶点数
  int numEdges;           // 图中当前边数
} GraphAdjList;

/* 建立图的邻接表结构 */
void CreateALGraph(GraphAdjList *G)
{
  int i, j, k;
  EdgeNode *e;

  printf("输入顶点数和边数:\n");
  scanf("%d,%d", &G->numVertexes, &G->numEdges); /* 输入顶点数和边数 */

  for (i = 0; i < G->numVertexes; i++)  /* 读入顶点信息，建立顶点表 */
  {
    scanf(" %c", &G->adjList[i].data);  /* 输入顶点信息，注意空格跳过换行符 */
    G->adjList[i].firstedge = NULL;     /* 将边表置为空表 */
  }

  for (k = 0; k < G->numEdges; k++)  /* 建立边表 */
  {
    printf("输入边（vi,vj）上的顶点序号:\n");
    scanf("%d,%d", &i, &j);  /* 输入边（vi,vj）上的顶点序号 */

    /* 向内存申请空间，生成边表结点（对应顶点 j） */
    e = (EdgeNode *)malloc(sizeof(EdgeNode));
    e->adjvex = j;                      /* 邻接序号为 j */
    e->next = G->adjList[i].firstedge;  /* 将 e 指向当前顶点 i 指向的结点 */
    G->adjList[i].firstedge = e;        /* 将当前顶点 i 的指针指向 e */

    /* 向内存申请空间，生成边表结点（对应顶点 i） */
    e = (EdgeNode *)malloc(sizeof(EdgeNode));
    e->adjvex = i;                      /* 邻接序号为 i */
    e->next = G->adjList[j].firstedge;  /* 将 e 指向当前顶点 j 指向的结点 */
    G->adjList[j].firstedge = e;        /* 将当前顶点 j 的指针指向 e */
  }
}
```

#### 十字链表

把邻接表与逆邻接表结合起来。

顶点表结点结构

<div style="display: flex;border:1px solid #000;width:300px;text-align: center;margin:0 auto">
  <span style="flex:1;border-right:1px solid #000">data</span>
  <span style="flex:1;border-right:1px solid #000">firstin</span>
  <span style="flex:1">firstout</span>
</div>

其中 firstin 表示入边表头指针，指向该顶点的入边表中第一个结点，firstout 表示出边表头指针，指向该顶点的出边表中的第一个结点。

边表结点结构

<div style="display: flex;border:1px solid #000;width:300px;text-align: center;margin:0 auto">
  <span style="flex:1;border-right:1px solid #000">tailvex</span>
  <span style="flex:1;border-right:1px solid #000">headvex</span>
  <span style="flex:1;border-right:1px solid #000">headlink</span>
  <span style="flex:1">taillink</span>
</div>

其中 tailvex 是指弧起点在顶点表的下标，headvex 是指弧终点在顶点表中的下标，headlink 是指入边表指针域，指向终点相同的下一条边，taillink 是指边表指针域，指向起点相同的下一条边。如果是网，还可以再增加一个 weight 域来存储权值。

#### 邻接多重表

边表结点结构

<div style="display: flex;border:1px solid #000;width:300px;text-align: center;margin:0 auto">
  <span style="flex:1;border-right:1px solid #000">ivex</span>
  <span style="flex:1;border-right:1px solid #000">ilink</span>
  <span style="flex:1;border-right:1px solid #000">jvex</span>
  <span style="flex:1">jlink</span>
</div>

其中 ivex 和 jvex 是与某条边依附的两个顶点在顶点表中下标。ilink 指向依附顶点 ivex 的下一条边，jlink 指向依附顶点 jvex 的下一条边。这就是邻接多重表结构。

#### 边集数组

边集数组是由两个一维数组构成。一个是存储顶点的信息；另一个是存储边的信息，这个边数组每个数据元素由一条边的起点下标（begin）​、终点下标（end）和权（weight）组成。

边数组结构

<div style="display: flex;border:1px solid #000;width:300px;text-align: center;margin:0 auto">
  <span style="flex:1;border-right:1px solid #000">begin</span>
  <span style="flex:1;border-right:1px solid #000">end</span>
  <span style="flex:1">weight</span>
</div>

其中 begin 是存储起点下标，end 是存储终点下标，weight 是存储权值。

### 图的遍历

从图中某一顶点出发访遍图中其余顶点，且使每一个顶点仅被访问一次，这一过程就叫做图的遍历（Traversing Graph）​。

#### 深度优先遍历

深度优先遍历（Depth_First_Search）​，也有称为深度优先搜索，简称为 DFS。它从图中某个顶点 v 出发，访问此顶点，然后从 v 的未被访问的邻接点出发深度优先遍历图，直至图中所有和 v 有路径相通的顶点都被访问到。若图中尚有顶点未被访问，则另选图中一个未曾被访问的顶点作起始点，重复上述过程，直至图中所有顶点都被访问到为止。

```c
typedef int Boolean;  /* Boolean 是布尔类型，其值是 TRUE 或 FALSE */
Boolean visited[MAX];  /* 访问标志的数组 */

/* 邻接矩阵的深度优先递归算法 */
void DFS(MGraph G, int i)
{
  int j;
  visited[i] = TRUE;
  printf("%c ", G.vexs[i]);  /* 打印顶点，也可以其他操作 */
  for (j = 0; j < G.numVertexes; j++)
    if (G.arc[i][j] == 1 &&!visited[j])
      DFS(G, j);  /* 对为访问的邻接顶点递归调用 */
}

/* 邻接矩阵的深度遍历操作 */
void DFSTraverse(MGraph G)
{
  int i;
  for (i = 0; i < G.numVertexes; i++)
    visited[i] = FALSE;  /* 初始所有顶点状态都是未访问过状态 */
  for (i = 0; i < G.numVertexes; i++)
    if (!visited[i]) /* 对未访问过的顶点调用 DFS，若是连通图，只会执行一次 */
      DFS(G, i);
}
```

```c
/* 邻接表的深度优先递归算法 */
void DFS(GraphAdjList GL, int i)
{
  EdgeNode *p;
  visited[i] = TRUE;
  printf("%c ", GL->adjList[i].data); /* 打印顶点，也可以其他操作 */
  p = GL->adjList[i].firstedge;
  while (p)
  {
    if (!visited[p->adjvex])
      DFS(GL, p->adjvex); /* 对为访问的邻接顶点递归调用 */
    p = p->next;
  }
}

/* 邻接表的深度遍历操作 */
void DFSTraverse(GraphAdjList GL)
{
  int i;
  for (i = 0; i < GL->numVertexes; i++)
    visited[i] = FALSE; /* 初始所有顶点状态都是未访问过状态 */
  for (i = 0; i < GL->numVertexes; i++)
    if (!visited[i]) /* 对未访问过的顶点调用 DFS，若是连通图，只会执行一次 */
      DFS(GL, i);
}
```

#### 广度优先遍历

广度优先遍历（Breadth_First_Search）​，又称为广度优先搜索，简称 BFS。

```c
/* 邻接矩阵的广度遍历算法 */
void BFSTraverse(MGraph G)
{
  int i, j;
  Queue Q;
  for (i = 0; i < G.numVertexes; i++)
    visited[i] = FALSE;
  InitQueue(&Q);  /* 初始化一辅助用的队列 */
  for (i = 0; i < G.numVertexes; i++)  /* 对每一个顶点做循环 */
  {
    if (!visited[i])  /* 若是未访问过就处理 */
    {
      visited[i]=TRUE;  /* 设置当前顶点访问过*/
      printf("%c ", G.vexs[i]); /* 打印顶点，也可以其他操作 */
      EnQueue(&Q,i);  /* 将此顶点入队列 */
      while (!QueueEmpty(Q))  /* 若当前队列不为空 */
      {
        DeQueue(&Q,&i);  /* 将队中元素出队列，赋值给 i */
        for (j=0;j<G.numVertexes;j++)
        {
          /* 判断其他顶点若与当前顶点存在边且未访问过 */
          if (G.arc[i][j] == 1 &&!visited[j])
          {
            visited[j]=TRUE;  /* 将找到的此顶点标记为已访问 */
            printf("%c ", G.vexs[j]);  /* 打印顶点 */
            EnQueue(&Q,j);  /* 将找到的此顶点入队列 */
          }
        }
      }
    }
  }
}
```

```c
/* 邻接表的广度遍历算法 */
void BFSTraverse(GraphAdjList GL)
{
  int i;
  EdgeNode *p;
  Queue Q;
  for (i = 0; i < GL->numVertexes; i++)
    visited[i] = FALSE;
  InitQueue(&Q);
  for (i = 0; i < GL->numVertexes; i++)
  {
    if (!visited[i])
    {
      visited[i]=TRUE;
      printf("%c ", GL->adjList[i].data); /* 打印顶点，也可以其他操作 */
      EnQueue(&Q, i);
      while (!QueueEmpty(Q))
      {
        DeQueue(&Q, &i);
        p = GL->adjList[i].firstedge; /* 找到当前顶点边表表头指针 */
        while (p)
        {
          if (!visited[p->adjvex])  /* 若此顶点未被访问 */
          {
            visited[p->adjvex]=TRUE;
            printf("%c ", GL->adjList[p->adjvex].data);
            EnQueue(&Q, p->adjvex);  /* 将此顶点入队列 */
          }
          p = p->next;  /* 指针指向下一个邻接点 */
        }
      }
    }
  }
}
```

### 最小生成树

构造连通网的最小代价生成树称为最小生成树（Minimum Cost Spanning Tree）。

#### 普里姆（Prim）算法

```c
/* Prim算法生成最小生成树 */
void MiniSpanTree_Prim (MGraph G)
{
  int min, i, j, k;
  int adjvex[MAXVEX];      /* 保存相关顶点下标 */
  int lowcost[MAXVEX];     /* 保存相关顶点间边的权值 */
  lowcost[0] = 0;          /* 初始化第一个顶点下标为0，即加入生成树 */
                           /* lowcost的值为0，在这里就是此下标加入生成树 */
  adjvex[0] = 0;           /* 初始化第一个顶点下标为0 */
  for (i = 1; i < G.numVertexes; i++)  /* 循环除下标为0外的全部顶点 */
  {
    lowcost[i] = G.arc[0][i]; /* 将顶点与之有权的权值存入数组 */
    adjvex[i] = 0;          /* 初始化都为v0的下标 */
  }
  for (i = 1; i < G.numVertexes; i++)
  {
    min = 32767; /* 初始化最小权值为32767，假设权值不超过这个数，也可根据实际情况修改，如65535等 */
    j = 1;
    k = 0;
    while (j < G.numVertexes)  /* 循环全部顶点 */
    {
      if (lowcost[j]!= 0 && lowcost[j] < min)
      { /* 如果权值不为0且权值小于min */
        min = lowcost[j];  /* 则让当前权值成为最小值 */
        k = j;             /* 将当前最小值的下标存入k */
      }
      j++;
    }
    printf("(%d, %d) ", adjvex[k], k); /* 打印当前顶点边中权值最小边 */
    lowcost[k] = 0; /* 将当前顶点的权值设置为0，表示此顶点已完成任务 */
    for (j = 1; j < G.numVertexes; j++)  /* 循环所有顶点 */
    {
      if (lowcost[j]!= 0 && G.arc[k][j] < lowcost[j])
      { /* 若下标为k顶点各边权值小于此前这些顶点未被加入生成树权值 */
        lowcost[j] = G.arc[k][j]; /* 将较小权值存入lowcost */
        adjvex[j] = k;            /* 将下标为k的顶点存入adjvex */
      }
    }
  }
}
```

#### 克鲁斯卡尔（Kruskal）算法

```c
/* 对边集数组Edge结构的定义 */
typedef struct
{
  int begin;
  int end;
  int weight;
} Edge;

/* Kruskal 算法生成最小生成树 */
void MiniSpanTree_Kruskal (MGraph G) /* 生成最小生成树 */
{
  int i, n, m;
  Edge edges[MAXEDGE];  /* 定义边集数组*/
  int parent[MAXVEX];  /* 定义一数组用来判断边与边是否形成环路 */
  /* 此处省略将邻接矩阵 G 转化为边集数组 edges 并按权由小到大排序的代码*/
  for (i = 0; i < G.numVertexes; i++)
    parent[i] = 0;  /* 初始化数组值为 0 */
  for (i = 0; i < G.numEdges; i++)  /* 循环每一条边 */
  {
    n = Find(parent, edges[i].begin);
    m = Find(parent, edges[i].end);
    if (n!= m)  /* 假如 n 与 m 不等，说明此边没有与现有生成树形成环路*/
    {
      parent[n] = m;  /* 将此边的结尾顶点放入下标为起点的 parent 中*/
                      /* 表示此顶点已经在生成树集合中 */
      printf("(%d, %d) %d ", edges[i].begin,
             edges[i].end, edges[i].weight);
    }
  }
}

int Find(int *parent, int f)  /* 查找连线顶点的尾部下标 */
{
  while (parent[f] > 0)
    f = parent[f];
  return f;
}
```

### 最短路径

对于网图来说，最短路径，是指两顶点之间经过的边上权值之和最少的路径，并且我们称路径上的第一个顶点是源点，最后一个顶点是终点。

#### 迪杰斯特拉（Dijkstra）算法

```c
#define MAXVEX 9
#define INFINITY 65535

typedef int Pathmatirx[MAXVEX];  // 用于存储最短路径下标的数组
typedef int ShortPathTable[MAXVEX];  // 用于存储到各点最短路径的权值和

/* Dijkstra算法，需要传入图的邻接矩阵G、起始顶点v0、最短路径下标数组P、最短路径长度数组D */
void ShortestPath_Dijkstra(MGraph G, int v0, Pathmatirx *P, ShortPathTable *D)
{
  int v, w, min;
  int final[MAXVEX];  /* final[w]=1 表示求得顶点v0到vw的最短路径 */
  for (v = 0; v < G.numVertexes; v++)
  {
    // 初始化数据
    final[v] = 0;  // 全部顶点初始化为未知最短路径状态
    (*D)[v] = G.matirx[v0][v];  // 将与v0点有连线的顶点加上权值
    (*P)[v] = 0;  // 初始化路径数组为0
  }
  (*D)[v0] = 0;  // v0至v0路径为0
  final[v0] = 1;  // v0至v0不需要求路径
  // 开始主循环，每次求得v0到某个v顶点的最短路径
  for (v = 1; v < G.numVertexes; v++)
  {
    min = INFINITY;  // 当前所知离v0顶点的最近距离
    for (w = 0; w < G.numVertexes; w++)  // 寻找离v0最近的顶点
    {
      if (!final[w] && (*D)[w] < min)
      {
        k = w;
        min = (*D)[w];  // w顶点离v0顶点更近
      }
    }
    final[k] = 1;  // 将目前找到的最近的顶点置为1
    for (w = 0; w < G.numVertexes; w++)  // 修正当前最短路径及距离
    {
      // 如果经过k顶点路径比现在这条路径长度更短
      if (!final[w] && (min + G.matirx[k][w] < (*D)[w]))
      {
        // 说明找到了更短的路径，修改d[w]和p[w]
        (*D)[w] = min + G.matirx[k][w];  // 修改当前路径长度
        (*P)[w] = k;  // 修改前驱顶点
      }
    }
  }
}
```

#### 弗洛伊德（Floyd）算法

```c
typedef int Pathmatirx[MAXVEX][MAXVEX];
typedef int ShortPathTable[MAXVEX][MAXVEX];

/* Floyd算法，求网图G中各顶点v到其余顶点w最短路径P[v][w]及带权长度D[v][w] */
void ShortestPath_Floyd(MGraph G, Pathmatirx *P, ShortPathTable *D)
{
  int v, w, k;
  for (v = 0; v < G.numVertexes; ++v)  /* 初始化D与P */
  {
    for (w = 0; w < G.numVertexes; ++w)
    {
      (*D)[v][w] = G.matirx[v][w];  /* D[v][w]值即为对应点间的权值*/
      (*P)[v][w] = w;               /* 初始化P */
    }
  }
  for (k = 0; k < G.numVertexes; ++k)
  {
    for (v = 0; v < G.numVertexes; ++v)
    {
      for (w = 0; w < G.numVertexes; ++w)
      {
        if ((*D)[v][w] > (*D)[v][k] + (*D)[k][w])
        { /* 如果经过下标为k顶点路径比原两点间路径更短 */
          /* 将当前两点间权值设为更小的一个 */
          (*D)[v][w] = (*D)[v][k] + (*D)[k][w];
          (*P)[v][w] = (*P)[v][k];/*路径设置经过下标为k的顶点*/
        }
      }
    }
  }
}
```

求最短路径的显示代码可以这样写。

```c
for (v = 0; v < G.numVertexes; ++v)
{
  for (w = v + 1; w < G.numVertexes; w++)
  {
    printf("v%d-v%d weight: %d ", v, w, D[v][w]);
    k = P[v][w];  /* 获得第一个路径顶点下标 */
    printf(" path: %d", v);  /* 打印源点 */
    while (k!= w)  /* 如果路径顶点下标不是终点 */
    {
      printf(" -> %d", k);  /* 打印路径顶点 */
      k = P[k][w];  /* 获得下一个路径顶点下标 */
    }
    printf(" -> %d\n", w);  /* 打印终点 */
  }
  printf("\n");
}
```

### 拓扑排序

在一个表示工程的有向图中，用顶点表示活动，用弧表示活动之间的优先关系，这样的有向图为顶点表示活动的网，我们称为 AOV 网（Activity On Vertex Network）。

设 G=(V,E)是一个具有 n 个顶点的有向图，V 中的顶点序列 v~1~，v~2~，……，v~n~，满足若从顶点 v~i~ 到 v~j~ 有一条路径，则在顶点序列中顶点 v~i~ 必在顶点 v~j~ 之前。则我们称这样的顶点序列为一个拓扑序列。

拓扑排序，其实就是对一个有向图构造拓扑序列的过程。

```c
typedef struct EdgeNode  /* 边表结点 */
{
  int adjvex;          /* 邻接点域，存储该顶点对应的下标 */
  int weight;          /* 用于存储权值，对于非网图可以不需要 */
  struct EdgeNode *next;  /* 链域，指向下一个邻接点   */
} EdgeNode;

typedef struct VertexNode  /* 顶点表结点 */
{
  int in;              /* 顶点入度 */
  int data;            /* 顶点域，存储顶点信息 */
  EdgeNode *firstedge; /* 边表头指针 */
} VertexNode, AdjList[MAXVEX];

typedef struct
{
  AdjList adjList;
  int numVertexes, numEdges;  /* 图中当前顶点数和边数 */
} graphAdjList, *GraphAdjList;

/* 拓扑排序，若 GL 无回路，则输出拓扑排序序列并返回 OK，若有回路返回 ERROR */
Status TopologicalSort(GraphAdjList GL)
{
  EdgeNode *e;
  int i, k, gettop;
  int top = 0;  /* 用于栈指针下标 */
  int count = 0;  /* 用于统计输出顶点的个数 */
  int *stack;  /* 建栈存储入度为 0 的顶点 */
  stack = (int *)malloc(GL->numVertexes * sizeof(int));
  for (i = 0; i < GL->numVertexes; i++)
  {
    if (GL->adjList[i].in == 0)
      stack[++top] = i;  /* 将入度为 0 的顶点入栈 */
  }
  while (top != 0)
  {
    gettop = stack[top--];  /* 出栈 */
    printf("%d -> ", GL->adjList[gettop].data);  /* 打印此顶点 */
    count++;  /* 统计输出顶点数 */
    for (e = GL->adjList[gettop].firstedge; e; e = e->next)
    { /* 对此顶点弧表遍历 */
      k = e->adjvex;
      if (!(--GL->adjList[k].in)) /*将 k 号顶点邻接点的入度减 1*/
        stack[++top] = k;  /*若为 0 则入栈，以便于下次循环输出 */
    }
  }
  if (count < GL->numVertexes) /* 如果 count 小于顶点数，说明存在环*/
    return ERROR;
  else
    return OK;
}
```

### 关键路径

在一个表示工程的带权有向图中，用顶点表示事件，用有向边表示活动，用边上的权值表示活动的持续时间，这种有向图的边表示活动的网，我们称之为 AOE 网（Activity On Edge Network）。

路径上各个活动所持续的时间之和称为路径长度，从源点到汇点具有最大长度的路径叫关键路径，在关键路径上的活动叫关键活动。

```c
/* 拓扑排序，用于关键路径计算 */
Status TopologicalSort(GraphAdjList GL)
{
  EdgeNode *e;
  int i, k, gettop;
  int top = 0;      /* 用于栈指针下标 */
  int count = 0;    /* 用于统计输出顶点的个数 */
  int *stack;       /* 建栈将入度为0的顶点入栈 */
  stack = (int *)malloc(GL->numVertexes * sizeof(int));
  for (i = 0; i < GL->numVertexes; i++)
  {
    if (0 == GL->adjList[i].in)
      stack[++top] = i;
  }
  int top2 = 0;                /* 初始化为0 */
  int *etv = (int *)malloc(GL->numVertexes * sizeof(int));/*事件最早发生时间*/
  for (i = 0; i < GL->numVertexes; i++)
    etv[i] = 0;                /* 初始化为0 */
  int *stack2 = (int *)malloc(GL->numVertexes * sizeof(int));/*初始化*/
  while (top != 0)
  {
    gettop = stack[top--];
    count++;
    stack2[++top2] = gettop;  /* 将弹出的顶点序号压入拓扑序列的栈 */
    for (e = GL->adjList[gettop].firstedge; e; e = e->next)
    {
      k = e->adjvex;
      if (!(--GL->adjList[k].in))
        stack[++top] = k;
      if ((etv[gettop] + e->weight) > etv[k])/*求各顶点事件最早发生时间值*/
        etv[k] = etv[gettop] + e->weight;
    }
  }
  if (count < GL->numVertexes)
    return ERROR;
  else
    return OK;
}
```

```c
/* 求关键路径，GL 为有向网，输出 GL 的各项关键活动 */
void CriticalPath(GraphAdjList GL)
{
  EdgeNode *e;
  int i, gettop, k, j;
  int ete, lte;  /* 声明活动最早发生时间和最迟发生时间变量 */
  TopologicalSort(GL);  /* 求拓扑序列，计算数组 etv 和 stack2 的值 */
  int *ltv = (int *)malloc(GL->numVertexes * sizeof(int));/*事件最晚发生时间*/
  for (i = 0; i < GL->numVertexes; i++)
    ltv[i] = etv[GL->numVertexes - 1];  /* 初始化 ltv */
  while (top2 != 0)  /* 计算 ltv */
  {
    gettop = stack2[top2--];  /* 将拓扑序列出栈，后进先出 */
    for (e = GL->adjList[gettop].firstedge; e; e = e->next)
    { /* 求各顶点事件的最迟发生时间 ltv 值 */
      k = e->adjvex;
      if (ltv[k] - e->weight < ltv[gettop])/*求各顶点事件最迟发生时间 ltv*/
        ltv[gettop] = ltv[k] - e->weight;
    }
  }
  for (j = 0; j < GL->numVertexes; j++)  /* 求 ete, lte 和关键活动 */
  {
    for (e = GL->adjList[j].firstedge; e; e = e->next)
    {
      k = e->adjvex;
      ete = etv[j];                /* 活动最早发生时间 */
      lte = ltv[k] - e->weight;    /* 活动最迟发生时间 */
      if (ete == lte)              /* 两者相等即在关键路径上 */
        printf("<v%d,v%d> length: %d ",
               GL->adjList[j].data, GL->adjList[k].data, e->weight);
    }
  }
}
```

## 查找

查找表按照操作方式来分有两大种：静态查找表和动态查找表。

静态查找表（Static Search Table）​：只作查找操作的查找表。它的主要操作有：

（1）查询某个“特定的”数据元素是否在查找表中。
（2）检索某个“特定的”数据元素和各种属性。

动态查找表（Dynamic Search Table）​：在查找过程中同时插入查找表中不存在的数据元素，或者从查找表中删除已经存在的某个数据元素。显然动态查找表的操作就是两个：

（1）查找时插入数据元素。
（2）查找时删除数据元素。

### 顺序表查找

顺序查找（Sequential Search）又叫线性查找，是最基本的查找技术，它的查找过程是：从表中第一个（或最后一个）记录开始，逐个进行记录的关键字和给定值比较，若某个记录的关键字和给定值相等，则查找成功，找到所查的记录；如果直到最后一个（或第一个）记录，其关键字和给定值比较都不等时，则表中没有所查的记录，查找不成功。

```c
/* 顺序查找，a 为数组，n 为要查找的数组个数，key 为要查找的关键字 */
int Sequential_Search(int *a, int n, int key)
{
  int i;
  for (i = 1; i <= n; i++)
  {
    if (a[i] == key)
      return i;
  }
  return 0;
}

/* 有哨兵顺序查找 */
int Sequential_Search2(int *a, int n, int key)
{
  int i;
  a[0] = key;  /* 设置a[0]为关键字值，我们称之为“哨兵”*/
  i = n;       /* 循环从数组尾部开始 */
  while (a[i]!= key)
  {
    i--;
  }
  return i;  /* 返回0则说明查找失败 */
}
```

### 有序表查找

#### 折半查找

折半查找（Binary Search）技术，又称为二分查找。它的前提是线性表中的记录必须是关键码有序（通常从小到大有序）​，线性表必须采用顺序存储。折半查找的基本思想是：在有序表中，取中间记录作为比较对象，若给定值与中间记录的关键字相等，则查找成功；若给定值小于中间记录的关键字，则在中间记录的左半区继续查找；若给定值大于中间记录的关键字，则在中间记录的右半区继续查找。不断重复上述过程，直到查找成功，或所有查找区域无记录，查找失败为止。

```c
/* 折半查找 */
int Binary_Search(int *a, int n, int key)
{
  int low, high, mid;
  low = 1;                    /* 定义最低下标为记录首位 */
  high = n;                   /* 定义最高下标为记录末位 */
  while (low <= high)
  {
    mid = (low + high) / 2;   /* 折半 */
    if (key < a[mid])         /* 若查找值比中值小 */
    {
      high = mid - 1;         /* 最高下标调整到中位下标小一位 */
    }
    else if (key > a[mid])    /* 若查找值比中值大 */
    {
      low = mid + 1;          /* 最低下标调整到中位下标大一位 */
    }
    else
    {
      return mid;             /* 若相等则说明mid即为查找到的位置 */
    }
  }
  return 0;
}
```

#### 插值查找

插值查找（Interpolation Search）是根据要查找的关键字 key 与查找表中最大最小记录的关键字比较后的查找方法，其核心就在于插值的计算公式 $\frac{key-a[low]}{a[high]-a[low]}$。

#### 斐波那契查找

```c
/* 斐波那契查找 */
int Fibonacci_Search(int *a, int n, int key)
{
  int low, high, mid, i, k;
  low = 1;                    /* 定义最低下标为记录首位 */
  high = n;                   /* 定义最高下标为记录末位 */
  k = 0;
  while (n > Fib(k) - 1)      /* 计算n位于斐波那契数列的位置，这里假设Fib函数已定义 */
    k++;
  for (i = n; i < Fib(k) - 1; i++)  /* 将不满的数值补全 */
    a[i] = a[n];

  while (low <= high)
  {
    mid = low + Fib(k - 1) - 1;  /* 计算当前分隔的下标 */
    if (key < a[mid])         /* 若查找值小于当前分隔记录 */
    {
      high = mid - 1;         /* 最高下标调整到分隔下标mid-1处 */
      k = k - 1;              /* 斐波那契数列下标减一位 */
    }
    else if (key > a[mid])    /* 若查找值大于当前分隔记录 */
    {
      low = mid + 1;          /* 最低下标调整到分隔下标mid+1处 */
      k = k - 2;              /* 斐波那契数列下标减两位 */
    }
    else
    {
      if (mid <= n)
        return mid;            /* 若相等则说明mid即为查找到的位置 */
      else
        return n;             /* 若mid>n说明是补全数值，返回n */
    }
  }
  return 0;
}

// 假设的斐波那契数列生成函数，这里简单示例，实际可能需要更完善的实现
int Fib(int index)
{
  if (index == 0)
    return 0;
  if (index == 1)
    return 1;
  int a = 0, b = 1, c;
  for (int i = 2; i <= index; i++)
  {
    c = a + b;
    a = b;
    b = c;
  }
  return b;
}
```

### 线性索引查找

索引就是把一个关键字与它对应的记录相关联的过程，一个索引由若干个索引项构成，每个索引项至少应包含关键字和其对应的记录在存储器中的位置等信息。

所谓线性索引就是将索引项集合组织为线性结构，也称为索引表。

#### 稠密索引

对于稠密索引这个索引表来说，索引项一定是按照关键码有序的排列。

#### 分块索引

分块有序，是把数据集的记录分成了若干块，并且这些块需要满足两个条件：

■ 　块内无序，即每一块内的记录不要求有序。
■ 　块间有序。

对于分块有序的数据集，将每块对应一个索引项，这种索引方法叫做分块索引。我们定义的分块索引的索引项结构分三个数据项：

■ 　最大关键码，它存储每一块中的最大关键字，这样的好处就是可以使得在它之后的下一块中的最小关键字也能比这一块最大的关键字要大；
■ 　存储了块中的记录个数，以便于循环时使用；
■ 　用于指向块首数据元素的指针，便于开始对这一块中记录进行遍历。

#### 倒排索引

### 二叉排序树

二叉排序树（Binary Sort Tree）​，又称为二叉查找树。它或者是一棵空树，或者是具有下列性质的二叉树。

■ 　若它的左子树不空，则左子树上所有结点的值均小于它的根结构的值；
■ 　若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值；
■ 　它的左、右子树也分别为二叉排序树。

```c
/* 二叉树的二叉链表结点结构定义 */
typedef struct BiTNode  /* 结点结构 */
{
  int data;            /* 结点数据 */
  struct BiTNode *lchild, *rchild;  /* 左右孩子指针 */
} BiTNode, *BiTree;

/* 递归查找二叉排序树 T 中是否存在 key */
/* 指针 f 指向 T 的双亲，其初始调用值为 NULL */
/* 若查找成功，则指针 p 指向该数据元素结点，并返回 TRUE */
/* 否则指针 p 指向查找路径上访问的最后一个结点并返回 FALSE */
typedef enum { FALSE, TRUE } Status;  // 假设之前定义了Status类型表示状态

Status SearchBST(BiTree T, int key, BiTree f, BiTree *p)
{
  if (!T)                    /* 查找不成功，树为空 */
  {
    *p = f;
    return FALSE;
  }
  else if (key == T->data)   /* 查找成功，找到目标结点 */
  {
    *p = T;
    return TRUE;
  }
  else if (key < T->data)    /* 目标值小于当前结点值，在左子树继续查找 */
  {
    return SearchBST(T->lchild, key, T, p);
  }
  else                       /* 目标值大于当前结点值，在右子树继续查找 */
  {
    return SearchBST(T->rchild, key, T, p);
  }
}

/* 当二叉排序树 T 中不存在关键字等于 key 的数据元素时，*/
/* 插入 key 并返回 TRUE，否则返回 FALSE */
Status InsertBST(BiTree *T, int key)
{
  BiTree p, s;
  if (!SearchBST(*T, key, NULL, &p))  /* 查找不成功 */
  {
    s = (BiTree)malloc(sizeof(BiTNode));
    s->data = key;
    s->lchild = s->rchild = NULL;
    if (!p)
      *T = s;                /* 插入 s 为新的根结点 */
    else if (key < p->data)
      p->lchild = s;         /* 插入 s 为左孩子 */
    else
      p->rchild = s;         /* 插入 s 为右孩子 */
    return TRUE;
  }
  else
    return FALSE;            /* 树中已有关键字相同的结点，不再插入 */
}

/* 若二叉排序树 T 中存在关键字等于 key 的数据元素时，则删除该数据元素结点，*/
/* 并返回 TRUE；否则返回 FALSE */
Status DeleteBST(BiTree *T, int key)
{
  if (!*T)  /* 不存在关键字等于 key 的数据元素 */
  {
    return FALSE;
  }
  else
  {
    if (key == (*T)->data)  /* 找到关键字等于 key 的数据元素 */
    {
      return Delete(T);  // 这里假设Delete函数已定义，用于实际删除结点操作，原代码此处可能有误，一般直接在此处实现删除逻辑或调用已有正确删除函数，以下给出修正思路的示例代码（实际可按需调整）
      // 以下是修正示例，直接在此函数内实现删除逻辑（原代码调用未定义的Delete函数可能有问题）
      /*
      BiTree temp;
      if ((*T)->rchild == NULL) {
          temp = *T;
          *T = (*T)->lchild;
          free(temp);
      } else if ((*T)->lchild == NULL) {
          temp = *T;
          *T = (*T)->rchild;
          free(temp);
      } else {
          temp = (*T)->rchild;
          while (temp->lchild != NULL) {
              temp = temp->lchild;
          }
          (*T)->data = temp->data;
          DeleteBST(&(*T)->rchild, temp->data);
      }
      return TRUE;
      */
    }
    else if (key < (*T)->data)
    {
      return DeleteBST(&(*T)->lchild, key);
    }
    else
    {
      return DeleteBST(&(*T)->rchild, key);
    }
  }
}
/* 从二叉排序树中删除结点 p，并重接它的左或右子树。*/
Status Delete(BiTree *p)
{
  BiTree q, s;
  if ((*p)->rchild == NULL)  /* 右子树空则只需重接它的左子树 */
  {
    q = *p;
    *p = (*p)->lchild;
    free(q);
  }
  else if ((*p)->lchild == NULL)  /* 只需重接它的右子树 */
  {
    q = *p;
    *p = (*p)->rchild;
    free(q);
  }
  else  /* 左右子树均不空 */
  {
    q = *p;
    s = (*p)->lchild;
    while (s->rchild)  /* 转左，然后向右到尽头（找待删结点的前驱）*/
    {
      q = s;
      s = s->rchild;
    }
    (*p)->data = s->data;  /* s 指向被删结点的直接前驱 */
    if (q != *p)
      q->rchild = s->lchild;  /* 重接 q 的右子树 */
    else
      q->lchild = s->lchild;  /* 重接 q 的左子树 */
    free(s);
  }
  return TRUE;
}
```

### 平衡二叉树（AVL 树）

平衡二叉树（Self-Balancing Binary Search Tree 或 Height-Balanced Binary Search Tree）​，是一种二叉排序树，其中每一个节点的左子树和右子树的高度差至多等于 1。将二叉树上结点的左子树深度减去右子树深度的值称为平衡因子 BF（Balance Factor）。距离插入结点最近的，且平衡因子的绝对值大于 1 的结点为根的子树，我们称为最小不平衡子树。

```c
/* 二叉树的二叉链表结点结构定义 */
typedef struct BiTNode  /* 结点结构 */
{
  int data;            /* 结点数据 */
  int bf;              /* 结点的平衡因子 */
  struct BiTNode *lchild, *rchild;  /* 左右孩子指针 */
} BiTNode, *BiTree;

/* 对以p为根的二叉排序树作右旋处理 */
/* 处理之后p指向新的树根结点，即旋转处理之前的左子树的根结点 */
void R_Rotate(BiTree *P)
{
  BiTree L;
  L = (*P)->lchild;        /* L指向P的左子树根结点 */
  (*P)->lchild = L->rchild; /* L的右子树挂接为P的左子树 */
  L->rchild = (*P);
  *P = L;                  /* P指向新的根结点 */
}

/* 对以P为根的二叉排序树作左旋处理 */
/* 处理之后P指向新的树根结点，即旋转处理之前的右子树的根结点 */
void L_Rotate(BiTree *P)
{
  BiTree R;
  R = (*P)->rchild;         /* R指向P的右子树根结点 */
  (*P)->rchild = R->lchild;  /* R的左子树挂接为P的右子树 */
  R->lchild = (*P);
  *P = R;                    /* P指向新的根结点 */
}

#define LH +1  /* 左高 */
#define EH 0   /* 等高 */
#define RH -1  /* 右高 */
/* 对以指针T所指结点为根的二叉树作左平衡旋转处理 */
/* 本算法结束时，指针T指向新的根结点 */
void LeftBalance(BiTree *T)
{
  BiTree L, Lr;
  L = (*T)->lchild;  /* L指向T的左子树根结点 */

  switch (L->bf)
  {
    /* 检查T的左子树的平衡度，并作相应平衡处理 */
    case LH:  /* 新结点插入在T的左孩子的左子树上，要作单右旋处理 */
      (*T)->bf = L->bf = EH;
      R_Rotate(T);
      break;

    case RH:  /* 新结点插入在T的左孩子的右子树上，要作双旋处理 */
      Lr = L->rchild;  /* Lr指向T的左孩子的右子树根 */

      switch (Lr->bf)  /* 修改T及其左孩子的平衡因子 */
      {
        case LH:
          (*T)->bf = RH;
          L->bf = EH;
          break;

        case EH:
          (*T)->bf = EH;
          L->bf = EH;
          break;

        case RH:
          (*T)->bf = EH;
          L->bf = LH;
          break;
      }

      Lr->bf = EH;
      L_Rotate(&(*T)->lchild);  /* 对T的左子树作左旋平衡处理 */
      R_Rotate(T);              /* 对T作右旋平衡处理 */
      break;
  }
}

/*
 * 若在平衡的二叉排序树 T 中不存在和 e 有相同关键字的结点，则插入一个
 * 数据元素为 e 的新结点并返回 1，否则返回 0。若因插入而使二叉排序树
 * 失去平衡，则作平衡旋转处理，布尔变量 taller 反映 T 长高与否。
 */
Status InsertAVL(BiTree *T, int e, Status *taller)
{
  if (!*T)
  {
    /* 插入新结点，树“长高”，置 taller 为 TRUE */
    *T = (BiTree)malloc(sizeof(BiTNode));
    (*T)->data = e;
    (*T)->lchild = (*T)->rchild = NULL;
    (*T)->bf = EH;
    *taller = TRUE;
  }
  else
  {
    if (e == (*T)->data)
    {
      /* 树中已存在和 e 有相同关键字的结点则不再插入 */
      *taller = FALSE;
      return FALSE;
    }

    if (e < (*T)->data)
    {
      /* 应继续在 T 的左子树中进行搜索 */
      if (!InsertAVL(&(*T)->lchild, e, taller)) /* 未插入 */
      {
        return FALSE;
      }

      if (*taller) /* 已插入到 T 的左子树中且左子树“长高” */
      {
        switch ((*T)->bf) /* 检查 T 的平衡度 */
        {
          case LH: /* 原本左子树比右子树高，需要作左平衡处理 */
            LeftBalance(T);
            *taller = FALSE;
            break;

          case EH: /* 原本左右子树等高，现因左子树增高而树增高 */
            (*T)->bf = LH;
            *taller = TRUE;
            break;

          case RH: /* 原本右子树比左子树高，现左右子树等高 */
            (*T)->bf = EH;
            *taller = FALSE;
            break;
        }
      }
    }
    else
    {
      /* 应继续在 T 的右子树中进行搜索 */
      if (!InsertAVL(&(*T)->rchild, e, taller)) /* 未插入 */
      {
        return FALSE;
      }

      if (*taller) /* 已插入到 T 的右子树中且右子树“长高” */
      {
        switch ((*T)->bf) /* 检查 T 的平衡度 */
        {
          case LH: /* 原本左子树比右子树高，现左、右子树等高 */
            (*T)->bf = EH;
            *taller = FALSE;
            break;

          case EH: /* 原本左右子树等高，现因右子树增高而树增高 */
            (*T)->bf = RH;
            *taller = TRUE;
            break;

          case RH: /* 原本右子树比左子树高，需要作右平衡处理 */
            RightBalance(T);
            *taller = FALSE;
            break;
        }
      }
    }
  }

  return TRUE;
}
```

### 多路查找树（B 树）

多路查找树（muitl-way search tree）​，其每一个结点的孩子数可以多于两个，且每一个结点处可以存储多个元素。

#### 2-3 树

2-3 树是这样的一棵多路查找树：其中的每一个结点都具有两个孩子（我们称它为 2 结点）或三个孩子（我们称它为 3 结点）​。一个 2 结点包含一个元素和两个孩子（或没有孩子）​，一个 3 结点包含一小一大两个元素和三个孩子（或没有孩子）​。

#### 2-3-4 树

#### B 树

B 树（B-tree）是一种平衡的多路查找树，2-3 树和 2-3-4 树都是 B 树的特例。结点最大的孩子数目称为 B 树的阶（order）。

一个 m 阶的 B 树具有如下属性：

■ 　如果根结点不是叶结点，则其至少有两棵子树。
■ 　每一个非根的分支结点都有 k-1 个元素和 k 个孩子，其中⌈m/2⌉≤k≤m。每一个叶子结点 n 都有 k-1 个元素，其中⌈m/2⌉≤k≤m。
■ 　所有叶子结点都位于同一层次。
■ 　所有分支结点包含下列信息数据（n,A~0~,K~1~,A~1~,K~2~,A~2~,…,K~n~,A~n~）​，其中：K~i~（i=1,2,…,n）为关键字，且 K~i~<K~i+1~（i=1,2,…,n-1）​；A~i~（i=0,2,…,n）为指向子树根结点的指针，且指针 A~i-1~ 所指子树中所有结点的关键字均小于 K~i~（i=1,2,…,n）​，A~n~ 所指子树中所有结点的关键字均大于 K~n~，n（⌈m/2⌉-1≤n ≤m-1）为关键字的个数（或 n+1 为子树的个数）​。

#### B+树

一棵 m 阶的 B+树和 m 阶的 B 树的差异在于：

■ 　有 n 棵子树的结点中包含有 n 个关键字；
■ 　所有的叶子结点包含全部关键字的信息，及指向含这些关键字记录的指针，叶子结点本身依关键字的大小自小而大顺序链接；
■ 　所有分支结点可以看成是索引，结点中仅含有其子树中的最大（或最小）关键字。

### 散列表查找（哈希表）

散列技术是在记录的存储位置和它的关键字之间建立一个确定的对应关系 f，使得每个关键字 key 对应一个存储位置 f（key）。对应关系 f 称为散列函数，又称为哈希（Hash）函数。按这个思想，采用散列技术将记录存储在一块连续的存储空间中，这块连续存储空间称为散列表或哈希表（Hash table）。那么关键字对应的记录存储位置我们称为散列地址。

散列技术既是一种存储方法，也是一种查找方法。

散列技术最适合的求解问题是查找与给定值相等的记录。

两个关键字 key1≠key2，但是却有 f（key1）＝ f（key2）​，这种现象我们称为冲突（collision）​，并把 key1 和 key2 称为这个散列函数的同义词（synonym）。

#### 散列函数的构造方法

**直接定址法**

**数字分析法**

**平方取中法**

**折叠法**

**除留余数法**

**随机数法**

#### 处理散列冲突的方法

**开放定址法**

开放定址法就是一旦发生了冲突，就去寻找下一个空的散列地址，只要散列表足够大，空的散列地址总能找到，并将记录存入。

**再散列函数法**

**链地址法**

**公共溢出区法**

```c
#define SUCCESS 1
#define UNSUCCESS 0
#define HASHSIZE 12  /* 定义散列表长为数组的长度 */
#define NULLKEY -32768

typedef struct
{
  int *elem;  /* 数据元素存储基址，动态分配数组 */
  int count;   /* 当前数据元素个数 */
} HashTable;

int m = 0;  /* 散列表表长，全局变量 */

/* 初始化散列表 */
Status InitHashTable(HashTable *H)
{
  int i;
  m = HASHSIZE;
  H->count = m;
  H->elem = (int *)malloc(m * sizeof(int));

  if (!H->elem)  // 检查内存分配是否成功
  {
    return UNSUCCESS;  // 分配失败返回 UNSUCCESS
  }

  for (i = 0; i < m; i++)
  {
    H->elem[i] = NULLKEY;
  }

  return SUCCESS;
}

/* 散列函数 */
int Hash(int key)
{
  return key % m; /* 除留余数法 */
}

/* 插入关键字进散列表 */
void InsertHash(HashTable *H, int key)
{
  int addr = Hash(key);  /* 求散列地址 */

  /* 如果不为空，则冲突，使用开放定址法的线性探测 */
  while (H->elem[addr] != NULLKEY)
  {
    addr = (addr + 1) % m;  /* 线性探测下一个地址 */
  }

  H->elem[addr] = key;  /* 直到有空位后插入关键字 */
}

/* 散列表查找关键字 */
Status SearchHash(HashTable H, int key, int *addr)
{
  *addr = Hash(key);  /* 求散列地址 */

  /* 如果不为空且不是要找的关键字，则冲突，使用开放定址法的线性探测 */
  while (H.elem[*addr] != key)
  {
    /* 开放定址法的线性探测 */
    *addr = (*addr + 1) % m;

    /* 如果探测到空位置或者回到原始散列地址，说明关键字不存在 */
    if (H.elem[*addr] == NULLKEY || *addr == Hash(key))
    {
      return UNSUCCESS;  /* 关键字不存在 */
    }
  }

  return SUCCESS;  /* 找到关键字 */
}
```

## 排序

假设含有 n 个记录的序列为{r~1~,r~2~,……,rn}，其相应的关键字分别为{k~1~,k~2~,……,k~n~}，需确定 1，2，……，n 的一种排列 p~1~,p~2~,……,p~n~，使其相应的关键字满足 k~p1~≤k~p2~≤……≤k~pn~（非递减或非递增）关系，即使得序列成为一个按关键字有序的序列{r~p1~,r~p2~,……,r~pn~}，这样的操作就称为排序。

假设 k~i~=k~j~（1≤i≤n,1≤j≤n,i≠j）​，且在排序前的序列中 r~i~ 领先于 r~j~（即 i<j）​。如果排序后 r~i~ 仍领先于 r~j~，则称所用的排序方法是稳定的；反之，若可能使得排序后的序列中 r~j~ 领先 r~i~，则称所用的排序方法是不稳定的。

内排序是在排序整个过程中，待排序的所有记录全部被放置在内存中。外排序是由于排序的记录个数太多，不能同时放置在内存，整个排序过程需要在内外存之间多次交换数据才能进行。

内排序分为：插入排序、交换排序、选择排序和归并排序。

```c
#define MAXSIZE 10  /* 用于要排序数组个数最大值，可根据需要修改 */

typedef struct
{
  int r[MAXSIZE + 1];  /* 用于存储要排序数组，r[0]用作哨兵或临时变量 */
  int length;          /* 用于记录顺序表的长度 */
} SqList;

/* 交换L中数组r的下标为i和j的值 */
void swap(SqList *L, int i, int j)
{
  int temp = L->r[i];
  L->r[i] = L->r[j];
  L->r[j] = temp;
}
```

### 冒泡排序

冒泡排序（Bubble Sort）一种交换排序，它的基本思想是：两两比较相邻记录的关键字，如果反序则交换，直到没有反序的记录为止。

```c
/* 对顺序表 L 作冒泡排序 */
void BubbleSort(SqList *L)
{
  int i, j;
  for (i = 1; i < L->length; i++)
  {
    for (j = L->length - 1; j >= i; j--)  /* 注意 j 是从后往前循环 */
    {
      if (L->r[j] > L->r[j + 1])  /* 若前者大于后者（注意这里与上一算法差异）*/
      {
        swap(L, j, j + 1);  /* 交换 L->r[j] 与 L->r[j+1] 的值 */
      }
    }
  }
}

/* 对顺序表 L 作改进冒泡算法 */
void BubbleSort2(SqList *L)
{
  int i, j;
  Status flag = TRUE;  /* flag 用来作为标记 */

  for (i = 1; i < L->length && flag; i++)  /* 若 flag 为 true 则退出循环 */
  {
    flag = FALSE;  /* 初始为 false */

    for (j = L->length - 1; j >= i; j--)
    {
      if (L->r[j] > L->r[j + 1])
      {
        swap(L, j, j + 1);  /* 交换 L->r[j] 与 L->r[j+1] 的值 */
        flag = TRUE;  /* 如果有数据交换，则 flag 为 true */
      }
    }
  }
}
```

### 简单选择排序

简单选择排序法（Simple Selection Sort）就是通过 n－i 次关键字间的比较，从 n－i ＋ 1 个记录中选出关键字最小的记录，并和第 i（1≤i≤n）个记录交换之。

```c
/* 对顺序表 L 作简单选择排序 */
void SelectSort(SqList *L)
{
  int i, j, min;

  for (i = 1; i < L->length; i++)
  {
    min = i;  /* 将当前下标定义为最小值下标 */

    /* 循环之后的数据 */
    for (j = i + 1; j <= L->length; j++)
    {
      /* 如果有小于当前最小值的关键字 */
      if (L->r[j] < L->r[min])
      {
        min = j;  /* 将此关键字的下标赋值给 min */
      }
    }

    /* 若 min 不等于 i，说明找到最小值，交换 */
    if (i != min)
    {
      swap(L, i, min);  /* 交换 L->r[i] 与 L->r[min] 的值 */
    }
  }
}
```

### 直接插入排序

直接插入排序（Straight Insertion Sort）的基本操作是将一个记录插入到已经排好序的有序表中，从而得到一个新的、记录数增 1 的有序表。

```c
/* 对顺序表 L 作直接插入排序 */
void InsertSort(SqList *L)
{
  int i, j;

  // 从第2个元素开始（下标为1的第二个元素，原文i=2可能是笔误）
  // 修正为 i=1 更符合常规实现（数组下标从0开始，但排序通常从第二个元素开始）
  // 如果r[0]作为哨兵，则应从i=2开始
  for (i = 2; i <= L->length; i++)
  {
    // 如果当前元素比前一个小，需要插入
    if (L->r[i] < L->r[i-1])
    {
      // 设置哨兵（如果r[0]未使用，可以暂存当前值）
      // 原文直接覆盖r[0]，假设r[0]是哨兵位
      int temp = L->r[i];  // 保存当前值，更安全的做法

      // 或者按原文使用r[0]作为哨兵：L->r[0] = L->r[i];
      // 但需要注意r[0]是否被占用，这里改为temp更通用

      j = i - 1;

      // 找到插入位置，同时后移元素
      while (j > 0 && L->r[j] > temp)  // 修正条件，避免越界
      {
        L->r[j+1] = L->r[j];  // 后移
        j--;
      }

      // 插入到正确位置
      L->r[j+1] = temp;

      // 如果使用哨兵位，恢复方式如下（但上面已用temp替代）：
      // L->r[j+1] = L->r[0];  // 如果是用r[0]暂存
    }
  }

  // 更简洁的实现（不依赖哨兵位）：
  /*
  for (i = 1; i < L->length; i++) {
    int key = L->r[i];
    j = i - 1;
    while (j >= 0 && L->r[j] > key) {
      L->r[j+1] = L->r[j];
      j--;
    }
    L->r[j+1] = key;
  }
  */
}
```

### 希尔排序

```c
/* 对顺序表 L 作希尔排序 */
void ShellSort(SqList *L)
{
  int i, j;
  int increment = L->length;  // 初始增量设为表长

  do
  {
    increment = increment / 3 + 1;  // 增量序列，保证最后一次增量为1

    for (i = increment + 1; i <= L->length; i++)  // 子序列插入排序
    {
      // 如果当前元素小于对应增量前的元素，需要插入
      if (L->r[i] < L->r[i - increment])
      {
        // 暂存当前元素（作为哨兵或临时存储）
        int temp = L->r[i];

        // 查找插入位置并后移元素
        for (j = i - increment; j > 0 && L->r[j] > temp; j -= increment)
        {
          L->r[j + increment] = L->r[j];  // 元素后移
        }

        // 插入到正确位置
        L->r[j + increment] = temp;
      }
    }
  } while (increment > 1);  // 当增量为1时排序完成
}
```

### 堆排序

堆是具有下列性质的完全二叉树：每个结点的值都大于或等于其左右孩子结点的值，称为大顶堆 ​；或者每个结点的值都小于或等于其左右孩子结点的值，称为小顶堆 ​。

堆排序（Heap Sort）就是利用堆（假设利用大顶堆）进行排序的方法。它的基本思想是，将待排序的序列构造成一个大顶堆。此时，整个序列的最大值就是堆顶的根结点。将它移走（其实就是将其与堆数组的末尾元素交换，此时末尾元素就是最大值）​，然后将剩余的 n-1 个序列重新构造成一个堆，这样就会得到 n 个元素中的次小值。如此反复执行，便能得到一个有序序列了。

```c
/* 对顺序表 L 进行堆排序 */
void HeapSort(SqList *L)
{
  int i;

  // 构建初始大顶堆（从最后一个非叶子节点开始）
  for (i = L->length / 2; i > 0; i--)
  {
    HeapAdjust(L, i, L->length);
  }

  // 逐个提取堆顶元素（最大值），并调整堆
  for (i = L->length; i > 1; i--)
  {
    // 将堆顶记录（最大值）和当前末尾记录交换
    swap(L, 1, i);

    // 重新调整剩余元素为大顶堆
    HeapAdjust(L, 1, i - 1);
  }
}

/* 已知 L->r[s..m] 中记录的关键字除 L->r[s] 之外均满足堆的定义 */
/* 本函数调整 L->r[s] 的关键字，使 L->r[s..m] 成为一个大顶堆 */
void HeapAdjust(SqList *L, int s, int m)
{
  int temp = L->r[s];  // 暂存当前节点值
  int j;

  // 沿关键字较大的孩子结点向下筛选
  for (j = 2 * s; j <= m; j *= 2)
  {
    // j 为关键字中较大的记录的下标（左右孩子中较大的那个）
    if (j < m && L->r[j] < L->r[j + 1])
    {
      j++;  // 右孩子较大时，j 指向右孩子
    }

    // 如果父节点已经大于等于较大的孩子，筛选结束
    if (temp >= L->r[j])
    {
      break;
    }

    // 否则，将较大的孩子上移
    L->r[s] = L->r[j];
    s = j;  // 更新 s 为孩子结点位置，继续向下筛选
  }

  // 插入暂存值到正确位置
  L->r[s] = temp;
}
```

### 归并排序

归并排序（Merging Sort）就是利用归并的思想实现的排序方法。它的原理是假设初始序列含有 n 个记录，则可以看成是 n 个有序的子序列，每个子序列的长度为 1，然后两两归并，得到⌈n/2⌉（⌈x⌉表示不小于 x 的最小整数）个长度为 2 或 1 的有序子序列；再两两归并，……，如此重复，直至得到一个长度为 n 的有序序列为止，这种排序方法称为 2 路归并排序。

### 快速排序

快速排序（Quick Sort）的基本思想是：通过一趟排序将待排记录分割成独立的两部分，其中一部分记录的关键字均比另一部分记录的关键字小，则可分别对这两部分记录继续进行排序，以达到整个序列有序的目的。
