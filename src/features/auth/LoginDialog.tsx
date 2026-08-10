import type { ReactNode } from 'react';
import { Button } from '@shared/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@shared/components/ui/Dialog';

/*
  로그인 모달.

  공통 Dialog를 비제어로 쓴다. 트리거로 쓸 요소(예: 헤더의 프로필 아이콘 버튼)는
  children으로 받아 asChild로 그대로 트리거가 되게 한다. 그래서 호출부는 프로필 버튼을
  이 컴포넌트로 감싸기만 하면 된다.

  재사용 프리미티브가 아니라 단일 사용 피처 컴포넌트다. 그래서 shared/ui가 아니라
  features/auth에 둔다.

  게스트 로컬 즐겨찾기를 유지하는 정책이라 별 버튼에서 로그인을 강제하지 않는다.
  즉 트리거는 사실상 프로필 아이콘 하나뿐이라 비제어로 충분하다.
*/

type LoginDialogProps = {
  // 트리거로 쓸 요소. asChild로 이 요소 자체가 트리거가 된다.
  children: ReactNode;
};

export function LoginDialog({ children }: LoginDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center text-center">
          <DialogTitle className="text-xl font-extrabold tracking-[-0.5px] text-foreground">
            Catch&nbsp;<span className="text-primary">Bus</span>
          </DialogTitle>
          <DialogDescription className="mt-2">
            로그인하고 즐겨찾는 정류장을 어디서든 확인하세요.
          </DialogDescription>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <KakaoLoginButton />
          <GoogleLoginButton />
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
          로그인하면{' '}
          <a href="#terms" className="underline hover:text-foreground">
            이용약관
          </a>
          과{' '}
          <a href="#privacy" className="underline hover:text-foreground">
            개인정보처리방침
          </a>
          에 동의하게 됩니다.
        </p>
      </DialogContent>
    </Dialog>
  );
}

/*
  카카오·구글 로그인 버튼은 각 브랜드 가이드가 배경색·문구·로고를 강제한다.
  그래서 공통 Button의 색 variant는 안 쓰고, 브랜드 색만 className으로 덮는다.
  이렇게 하면 Button의 base(포커스 링·disabled·레이아웃·사이즈)는 그대로 재사용하고
  색만 브랜드 스펙으로 바꾼다. 공식 로고 SVG와 실제 OAuth 호출은 인증을 붙일 때 채운다.
*/

function KakaoLoginButton() {
  return (
    // TODO(auth): 카카오 OAuth 연동
    <Button className="w-full bg-[#FEE500] text-black/85 hover:bg-[#FEE500] hover:brightness-95">
      {/* TODO(brand): 카카오 공식 심볼 SVG */}
      카카오로 시작하기
    </Button>
  );
}

function GoogleLoginButton() {
  return (
    // TODO(auth): 구글 OAuth 연동
    <Button
      variant="secondary"
      className="w-full border-[#747775] bg-card text-foreground hover:bg-muted"
    >
      {/* TODO(brand): 구글 공식 G 로고 SVG */}
      Google로 시작하기
    </Button>
  );
}
