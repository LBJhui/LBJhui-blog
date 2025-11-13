# 线性表

## 【2009 年统考——第 42 题】

已知一个带有表头结点的单链表，结点结构为：

<div style="display: flex;border:1px solid #000;width:200px;text-align: center;margin:0 auto"><span style="flex:1;border-right:1px solid #000">data</span><span style="flex:1">next</span></div>

假设该链表只给出了头指针 list。在不改变链表的前提下，请设计一个尽可能高效的算法，查找链表中倒数第 k 个位置上的结点（k 为正整数）。若查找成功，算法输出该结点的 data 域的值，并返回 1；否则，只返回 0。要求：
(1). 描述算法的基本设计思想。
(2). 描述算法的详细实现步骤。
(3). 根据设计思想和实现步骤，采用程序设计语言描述算法（使用 C、C++或 Java 语言实现），关键之处请给出简要注释。

:::details 【解析】

【解析】本题属于比较基础的算法题。下面，给出详细地解答过程。

(1). 算法的基本思想：定义两个指针 p 和 q，开始时均指向链表头结点的下一个结点位置；令 p 指针沿着链表移动，并且启动计数器 count 开始计数（初始时，count=0）；当 p 指针移动到链表表尾时，q 指针所指向的结点即倒数第 k 个结点。
(2). 算法的详细实现步骤如下：

(A). 令 p 和 q 均指向链表表头结点的下一个结点，令 count=0;
(B). 若 p 为空，即该单链表只有一个表头结点，则转(E);
(C). 若 count=k，则 q 指向下一个结点。否则，count=count+1;
(D). p 指向下一个结点，转(B);
(E). 若 count=k,则查找成功，输出该结点的 data 域的值，并返回 1；否则，查找失败，返回 0。

(3). 采用 C 语言，实现如上的算法，代码如下。

```c
#include <stdio.h>
#include <stdlib.h>

/* 单链表结点定义 */
typedef struct LNode {
  int data;               /* 数据域 */
  struct LNode *link;     /* 指针域，指向下一个结点 */
} *LinkList;              /* LinkList 是指向 LNode 的指针类型 */

/* 查找倒数第 k 个结点 */
/* 初始条件：链表 list 已存在，k > 0 */
/* 操作结果：若找到，返回 1 并打印结点值；否则返回 0 */
int SearchN(LinkList list, int k) {
  LinkList p, q;          /* p 用于遍历，q 用于定位倒数第 k 个结点 */
  int count = 0;          /* 计数器，记录已遍历的结点数 */

  /* 检查链表是否为空（list->link 是否为 NULL） */
  if (list == NULL || list->link == NULL) {
    return 0;  /* 空链表，查找失败 */
  }

  p = q = list->link;     /* p 和 q 初始指向第一个数据结点（跳过头结点） */

  /* 遍历链表 */
  while (p != NULL) {
    if (count < k) {
      count++;  /* 前 k 个结点仅移动 p，初始化 q 的位置 */
    } else {
      q = q->link;  /* 后续结点同时移动 p 和 q，保持间距 k */
    }
    p = p->link;
  }

  /* 检查是否找到（链表长度是否 ≥ k） */
  if (count < k) {
    return 0;  /* 链表长度不足 k，查找失败 */
  } else {
    printf("%d", q->data);  /* 打印倒数第 k 个结点的值 */
    return 1;               /* 查找成功 */
  }
}

/* ================ 测试代码 ================ */
int main() {
  /* 构建链表：头结点 -> 1 -> 2 -> 3 -> 4 -> 5 */
  LinkList head = (LinkList)malloc(sizeof(struct LNode));
  head->link = NULL;

  LinkList p = head;
  for (int i = 1; i <= 5; i++) {
    LinkList newNode = (LinkList)malloc(sizeof(struct LNode));
    newNode->data = i;
    newNode->link = NULL;
    p->link = newNode;
    p = p->link;
  }

  /* 测试 SearchN */
  int k = 2;
  printf("查找倒数第%d个结点：", k);
  if (!SearchN(head, k)) {
    printf("未找到（链表长度不足或为空）\n");
  }

  /* 释放内存（实际使用时需遍历释放所有结点） */
  free(head);
  return 0;
}
```

:::

## 【2010 年统考——第 42 题】

设将 n（n>1）个整数存放到一维数组 R 中。试设计一个在时间和空间两方面都尽可能高效的算法。将 R 中保存的序列循环左移 p（0 < p < n ）个位置，即将 R 中的数据由（X~0~,X~1~, …, X~n-1~）变换为（X~p~, X~p+1~,…, X~n-1~, X~0~, X~1~,…, X~p-1~）。要求：

(1). 给出算法的基本设计思想。
(2). 根据设计思想，采用 C 或 C++或 Java 语言描述算法，关键之处给出注释。
(3). 说明你所设计算法的时间复杂度和空间复杂度。

:::details 【解析】

(1). 本算法的基本思想为：先将 n 个数据 x~0~x~1~…x~p~…x~n-1~ 原地逆置，得到 x~n-1~…x~p~x~p-1~…x~0~,然后再将前 n-p 个和后 p 个元素分别原地逆置，得到最终结果:x~p~x~p+1~…x~n-1~x~0~x~1~…x~p-1~。
(2). 算法实现如下。

```c
void reverse(int r[], int left, int right) {
  int k = left, j = right, temp;  // k 等于左边界 left, j 等于右边界 right
  while (k < j) {
    // 交换 r[k] 和 r[j]
    temp = r[k];
    r[k] = r[j];
    r[j] = temp;
    k++;  // k 右移一个位置
    j--;  // j 左移一个位置
  }
}

void shift(int r[], int n, int p) {
  if (p > 0 && p < n) {
    reverse(r, 0, n - 1);        // 将表 r 中的全部元素逆置
    reverse(r, 0, n - p - 1);    // 将表 r 中 0 到 n-p-1 的元素逆置
    reverse(r, n - p, n - 1);    // 将表 r 中 n-p 到 n-1 的元素逆置
  }
}
```

(3). 上述算法 shift 中，总共逆置了 3 次表，第一次将表中的元素全部逆置，第二次逆置了表中元素 0 到 n-p-1 的部分，第二次逆置了 n-p 到 n-1 的部分。而 shift 里面的函数 reverse 里面只有一个循环，可见算法的时间复杂度为 O(n)。

该算法借用了一个临时变量 temp，用来暂存当前待交换的元素，所以算法的空间复杂度为 O(1)。

:::
