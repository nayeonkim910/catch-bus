import { REQUEST_TIMEOUT_MESSAGE, toTimeoutError } from './busApi';

describe('toTimeoutError', () => {
  it('타임아웃 중단은 사용자용 Error로 바꾼다', () => {
    const mapped = toTimeoutError(new DOMException('timed out', 'TimeoutError'));

    expect(mapped).toBeInstanceOf(Error);
    expect(mapped?.message).toBe(REQUEST_TIMEOUT_MESSAGE);
  });

  it('호출부 취소(AbortError)는 null을 반환한다 (원본이 그대로 전파됨)', () => {
    expect(toTimeoutError(new DOMException('aborted', 'AbortError'))).toBeNull();
  });

  it('DOMException이 아닌 일반 에러도 null을 반환한다', () => {
    expect(toTimeoutError(new Error('network down'))).toBeNull();
  });
});
