import React, { useState, useCallback, useRef } from 'react';
import { set, unset, ObjectInputProps } from 'sanity';
import { Box, Button, Card, Flex, Stack, Text, Inline, Spinner } from '@sanity/ui';
import { UploadIcon, TrashIcon, ImageIcon } from '@sanity/icons';

// The expected shape of our r2-image object
export interface R2ImageValue {
  _type?: 'r2-image';
  url?: string;
  alt?: string;
}

export function R2ImageUpload(props: ObjectInputProps<R2ImageValue>) {
  const { value, onChange, members, renderField } = props;
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Get presigned URL from our Next.js API
      const res = await fetch('/api/r2-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get presigned URL from server');
      }

      const { presignedUrl, publicUrl } = await res.json();

      // 2. Upload file directly to R2 using the presigned URL
      const uploadRes = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file to Cloudflare R2');
      }

      // 3. Patch the Sanity document with the new public URL
      onChange(
        set({
          ...value,
          _type: 'r2-image',
          url: publicUrl,
        })
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be uploaded again if it failed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = useCallback(() => {
    // Only unset the URL, keeping the alt text if they want
    onChange(
      set({
        ...value,
        url: undefined,
      })
    );
  }, [onChange, value]);

  // Find the 'alt' field member so we can render it below the image
  const altFieldMember = members.find(
    (member) => member.kind === 'field' && member.name === 'alt'
  );

  return (
    <Stack space={3}>
      {/* File Input (Hidden) */}
      <input
        type="file"
        accept="image/*,video/*,audio/*"
        ref={fileInputRef}
        onChange={handleUpload}
        style={{ display: 'none' }}
      />

      <Card padding={3} border radius={2} tone={error ? 'critical' : 'default'}>
        <Stack space={4}>
          {value?.url ? (
            <Stack space={3}>
              <Box style={{ position: 'relative', width: '100%', maxHeight: '400px', overflow: 'hidden', borderRadius: '4px', backgroundColor: '#1a1a1a' }}>
                {value.url.match(/\.(mp4|webm|ogg)$/i) ? (
                   <video src={value.url} controls style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
                ) : value.url.match(/\.(mp3|wav)$/i) ? (
                   <audio src={value.url} controls style={{ width: '100%' }} />
                ) : (
                  <img
                    src={value.url}
                    alt={value.alt || 'Uploaded to R2'}
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block' }}
                  />
                )}
              </Box>

              <Flex justify="space-between" align="center">
                <Text size={1} textOverflow="ellipsis" style={{ maxWidth: '80%' }}>
                  <a href={value.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                    {value.url}
                  </a>
                </Text>
                <Button
                  mode="ghost"
                  tone="critical"
                  icon={TrashIcon}
                  text="Remove Media"
                  onClick={handleRemove}
                />
              </Flex>
            </Stack>
          ) : (
            <Flex align="center" justify="center" direction="column" gap={3} padding={4}>
              <Box>
                <ImageIcon style={{ fontSize: '40px', opacity: 0.5 }} />
              </Box>
              <Text size={2} weight="medium">
                Upload to Cloudflare R2
              </Text>
              <Text size={1} muted>
                Images, Audio, or Video will be securely hosted on your CDN.
              </Text>
              <Box marginTop={3}>
                <Button
                  icon={isUploading ? Spinner : UploadIcon}
                  text={isUploading ? 'Uploading...' : 'Select File'}
                  tone="primary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                />
              </Box>
            </Flex>
          )}

          {error && (
            <Card padding={3} tone="critical" radius={2}>
              <Text size={1}>{error}</Text>
            </Card>
          )}
        </Stack>
      </Card>

      {/* Render the alt text field normally using Sanity's renderField */}
      {altFieldMember && renderField && (
        <Box marginTop={3}>
          {renderField(altFieldMember as any)}
        </Box>
      )}
    </Stack>
  );
}
