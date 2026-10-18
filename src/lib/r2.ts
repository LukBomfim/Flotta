import 'server-only'
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const bucket = process.env.R2_BUCKET!

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  // Sem isso, versões recentes do SDK adicionam checksums à URL e o R2 rejeita
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
})

export function urlParaUpload(caminho: string, mime: string, tamanho: number) {
  return getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: bucket,
      Key: caminho,
      ContentType: mime,
      ContentLength: tamanho,
    }),
    { expiresIn: 300 }
  )
}

export function urlParaDownload(caminho: string, nomeOriginal: string) {
  return getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: bucket,
      Key: caminho,
      ResponseContentDisposition: `inline; filename*=UTF-8''${encodeURIComponent(nomeOriginal)}`,
    }),
    { expiresIn: 120 }
  )
}

export async function metadadosDoObjeto(caminho: string) {
  try {
    const r = await r2.send(
      new HeadObjectCommand({ Bucket: bucket, Key: caminho })
    )
    return { tamanho: r.ContentLength ?? 0, mime: r.ContentType ?? '' }
  } catch {
    return null
  }
}

export async function apagarObjeto(caminho: string) {
  await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: caminho }))
}