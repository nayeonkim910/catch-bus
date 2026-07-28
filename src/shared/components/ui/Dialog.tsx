import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@shared/utils/cn';

/*
  공통 Dialog 컴포넌트

  Radix Dialog를 이 프로젝트의 스타일 토큰으로 감싼다. 
  포커스 트랩, Escape 닫기, 포커스 복귀, aria-modal 같은 동작·접근성은 Radix가 처리한다.

  compound(합성) 방식이고 제어/비제어 둘 다 지원한다.
    Dialog             열림 상태를 갖는 루트. 비제어는 defaultOpen, 제어는 open + onOpenChange.
    DialogTrigger      여는 버튼(asChild로 임의 요소를 트리거로 쓸 수 있다).
    DialogContent      화면 중앙 소형 모달. 내부에서 Portal + 딤+블러 오버레이 + 닫기(X)를 묶는다.
    DialogTitle        제목. Radix가 요구하므로 항상 넣는다. 숨길 땐 sr-only.
    DialogDescription  보조 설명(선택).
    DialogClose        내용 안에서 쓰는 커스텀 닫기 버튼(예: 취소).

  등장·퇴장은 tw-animate-css의 animate-in/out + fade/zoom을 Radix의 data-state에 걸어 준다.
*/

// pass-through(스타일 없음). 동작만 Radix가 제공한다.
// 함수 래퍼로 두는 건 react-refresh 규칙 때문이다. const 별칭으로 export하면
// 이 파일이 컴포넌트만 export하지 않는 것으로 보여 fast-refresh 경고가 난다.
export function Dialog(props: ComponentPropsWithRef<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

export function DialogTrigger(props: ComponentPropsWithRef<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

export function DialogClose(props: ComponentPropsWithRef<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close {...props} />;
}

// 중앙 소형 모달. Portal로 붙이고 딤+블러 오버레이를 깐 뒤 카드(max-w-sm)를 중앙에 띄운다.
// 우상단 닫기(X)를 기본 포함한다.
export function DialogContent({
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2',
          'rounded-2xl border border-border bg-card p-6 shadow-xl focus:outline-none',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="닫기"
          className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <X className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

// 제목. 접근성상 필수(aria-labelledby로 연결).
export function DialogTitle({
  className,
  ...props
}: ComponentPropsWithRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('text-lg font-bold text-foreground', className)}
      {...props}
    />
  );
}

// 제목 아래 보조 설명(선택). aria-describedby로 연결.
export function DialogDescription({
  className,
  ...props
}: ComponentPropsWithRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('mt-1 text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}
