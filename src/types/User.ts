import { z } from "zod";

// 유저 데이터에 대한 Zod 스키마 정의
export const userScheme = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(18), // 나이는 최소 18 이상이어야 한다고 가정
});

// User 타입은 userScheme의 infer 타입으로 정의
export type User = z.infer<typeof userScheme>;
