import clsx from "clsx";

function Input({
  type,
  name,
  placeholder,
  required,
  minLength,
  maxLength,
  defaultValue,
  pattern,
  title,
  autoComplete,
  error,
  className,
  errorClassName,
}: {
  type: string;
  name: string;
  placeholder?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
  pattern?: string;
  title?: string;
  autoComplete?: boolean;
  error?: string;
  className?: string;
  errorClassName?: string;
}) {
  return (
    <>
      <input
        type={type}
        name={name}
        placeholder={
          placeholder ? name[0].toUpperCase() + name.slice(1) : undefined
        }
        aria-label={name}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        title={title}
        defaultValue={defaultValue}
        autoComplete={autoComplete ? "on" : undefined}
        spellCheck="false"
        className={clsx(
          "px-4 py-2 border border-stone-100 rounded placeholder:text-stone-400",
          error && "border-red-500",
          className
        )}
      />
      {error && (
        <p className={clsx("text-red-500 text-sm", errorClassName)}>{error}</p>
      )}
    </>
  );
}

function Textarea({
  name,
  required,
  minLength,
  maxLength,
  defaultValue,
  rows,
  cols,
  resize,
  className,
}: {
  name: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
  rows?: number;
  cols?: number;
  resize?: "x" | "y" | "both";
  className?: string;
}) {
  return (
    <textarea
      name={name}
      placeholder={name[0].toUpperCase() + name.slice(1)}
      aria-label={name}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      defaultValue={defaultValue}
      rows={rows}
      cols={cols}
      spellCheck={false}
      className={clsx(
        "border border-stone-100 rounded placeholder:text-stone-400",
        `resize-${resize || "none"}`,
        className
      )}
    />
  );
}

export function Username({
  username,
  error,
  className,
  errorClassName,
}: {
  username?: string;
  error?: string;
  className?: string;
  errorClassName?: string;
}) {
  return (
    <Input
      type="text"
      name="username"
      placeholder
      required
      minLength={3}
      maxLength={20}
      pattern="[a-zA-Z0-9]+"
      title="Username can only contain letters and numbers"
      defaultValue={username}
      autoComplete
      error={error}
      className={className}
      errorClassName={errorClassName}
    />
  );
}

export function Email({ error }: { error?: string }) {
  return (
    <Input
      type="email"
      name="email"
      placeholder
      required
      autoComplete
      error={error}
    />
  );
}

export function Password({
  signingUp,
  error,
}: {
  signingUp?: boolean;
  error?: string;
}) {
  return (
    <Input
      type="password"
      name="password"
      placeholder
      required
      minLength={signingUp ? 6 : undefined}
      maxLength={signingUp ? 20 : undefined}
      autoComplete
      error={error}
    />
  );
}

export function Title({
  title,
  error,
  className,
  errorClassName,
}: {
  title: string;
  error?: string;
  className?: string;
  errorClassName?: string;
}) {
  return (
    <Input
      type="text"
      name="title"
      placeholder
      required
      defaultValue={title}
      maxLength={100}
      error={error}
      className={className}
      errorClassName={errorClassName}
    />
  );
}

export function Bio({
  bio,
  resize,
  className,
}: {
  bio?: string;
  resize?: "x" | "y" | "both";
  className?: string;
}) {
  return (
    <Textarea
      name="bio"
      maxLength={160}
      defaultValue={bio}
      rows={8}
      cols={40}
      resize={resize}
      className={className}
    />
  );
}

export function Body({
  body,
  resize,
  className,
}: {
  body: string;
  resize?: "x" | "y" | "both";
  className?: string;
}) {
  return (
    <Textarea
      name="body"
      required
      defaultValue={body}
      rows={10}
      resize={resize}
      className={className}
    />
  );
}
