import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../utils/cn';

/*
  공통 Tabs 컴포넌트
 
  Radix Tabs를 이 프로젝트의 스타일 토큰으로 감싸는 방식으로 개발
  동작이나 접근성만 radix 제공

  compound(합성) 방식 채택
    Tabs         활성 탭 상태를 갖는 루트. 하위에 값을 공유한다.
    TabsList     탭 버튼들을 담는 List.
    TabsTrigger  각 탭 버튼. value로 짝을 맞춘다.
    TabsContent  각 탭의 내용. 같은 value의 Trigger가 활성일 때만 보인다.

  세그먼트(알약형) 스타일이다. 회색 트랙 안에 버튼들이 붙어 있고, 선택된 버튼이
  흰 알약으로 떠 보인다. 색은 전부 semantic 토큰이라 라이트/다크가 자동으로 바뀐다.

  사용 예:
    <Tabs defaultValue="detail">
      <TabsList>
        <TabsTrigger value="detail">버스 상세</TabsTrigger>
        <TabsTrigger value="favorites">즐겨찾기</TabsTrigger>
      </TabsList>
      <TabsContent value="detail">...</TabsContent>
      <TabsContent value="favorites">...</TabsContent>
    </Tabs>
*/

// 루트. 활성 탭 상태를 관리한다.
// 비제어는 defaultValue, 제어는 value + onValueChange로 쓴다.
export function Tabs(props: ComponentPropsWithRef<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root {...props} />;
}

// 탭 버튼들을 담는 트랙(회색 띠). 안쪽 padding(p-1)이 활성 알약이 떠 보이는 여백을 만든다.
export function TabsList({
  className,
  ...props
}: ComponentPropsWithRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('inline-flex gap-1 rounded-lg bg-muted p-1', className)}
      {...props}
    />
  );
}

// 각 탭 버튼.
// 비활성: 흐린 글자(text-muted-foreground), hover 시 진해진다.
// 활성(data-[state=active]): 흰 알약(bg-card) + 옅은 그림자 + 진한 글자.
// data-[state=active]는 Radix가 활성 Trigger에 붙이는 표식이다.
export function TabsTrigger({
  className,
  ...props
}: ComponentPropsWithRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

// 각 탭의 내용 패널. 같은 value의 Trigger가 활성일 때만 렌더된다.
// Radix가 이 패널을 키보드로 도달 가능하게(tabIndex) 만들어, 포커스 시 링을 보인다.
export function TabsContent({
  className,
  ...props
}: ComponentPropsWithRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    />
  );
}
