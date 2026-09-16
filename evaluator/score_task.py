import argparse
import json
import os
import subprocess
from pathlib import Path


REQUIRED_METADATA_KEYS = [
    "track",
    "task_id",
    "language",
    "test_command",
    "correct_solution",
    "flawed_solution",
    "evaluation",
]


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def resolve_task_path(task_path_arg: str) -> Path:
    raw_path = Path(task_path_arg)
    if not raw_path.is_absolute():
        raw_path = repo_root() / raw_path
    return raw_path.resolve()


def is_inside_repo(path: Path) -> bool:
    try:
        path.relative_to(repo_root())
        return True
    except ValueError:
        return False


def load_task_metadata(task_dir: Path) -> tuple[dict, list[str]]:
    task_json_path = task_dir / "task.json"
    errors = []

    if not task_json_path.exists():
        return {}, [f"Missing task metadata file: {task_json_path}"]

    try:
        with task_json_path.open("r", encoding="utf-8") as file:
            metadata = json.load(file)
    except json.JSONDecodeError as error:
        return {}, [f"Invalid JSON in task.json: {error}"]

    for key in REQUIRED_METADATA_KEYS:
        if key not in metadata:
            errors.append(f"Missing required metadata key: {key}")

    return metadata, errors


def validate_required_files(task_dir: Path, metadata: dict) -> list[str]:
    required_files = [
        ("README.md", "README.md"),
        ("correct solution", metadata.get("correct_solution")),
        ("flawed solution", metadata.get("flawed_solution")),
        ("evaluation", metadata.get("evaluation")),
    ]

    errors = []
    for label, relative_path in required_files:
        if not relative_path:
            continue

        file_path = (task_dir / relative_path).resolve()
        if not is_inside_repo(file_path):
            errors.append(f"{label} path escapes repository: {relative_path}")
        elif not file_path.exists():
            errors.append(f"Missing {label} file: {relative_path}")

    return errors


def print_task_summary(task_dir: Path, metadata: dict) -> None:
    print("Task summary")
    print("------------")
    print(f"Task path: {task_dir}")
    print(f"Track: {metadata['track']}")
    print(f"Task ID: {metadata['task_id']}")
    print(f"Language: {metadata['language']}")
    print(f"Test command: {metadata['test_command']}")
    print(f"Correct solution path: {metadata['correct_solution']}")
    print(f"Flawed solution path: {metadata['flawed_solution']}")
    print(f"Evaluation path: {metadata['evaluation']}")
    print(flush=True)


def find_winget_mingw_bin() -> Path | None:
    packages_dir = (
        Path.home()
        / "AppData"
        / "Local"
        / "Microsoft"
        / "WinGet"
        / "Packages"
    )
    if not packages_dir.exists():
        return None

    for compiler_path in packages_dir.glob("BrechtSanders.WinLibs*/mingw64/bin/g++.exe"):
        return compiler_path.parent

    return None


def build_subprocess_env() -> dict:
    env = os.environ.copy()
    extra_path_dirs = []

    node_dir = Path("C:/Program Files/nodejs")
    if node_dir.exists():
        extra_path_dirs.append(str(node_dir))

    mingw_bin = find_winget_mingw_bin()
    if mingw_bin is not None:
        extra_path_dirs.append(str(mingw_bin))

    if extra_path_dirs:
        env["PATH"] = os.pathsep.join(extra_path_dirs + [env.get("PATH", "")])

    return env


def run_test_command(task_dir: Path, test_command: str) -> int:
    print("Running tests")
    print("-------------")
    print(test_command)
    print(flush=True)

    completed = subprocess.run(
        test_command,
        cwd=task_dir,
        shell=True,
        env=build_subprocess_env(),
    )

    if completed.returncode == 0:
        print("\nTest command passed.")
    else:
        print(f"\nTest command failed with exit code {completed.returncode}.")

    return completed.returncode


def score_task(task_path: Path) -> int:
    """Validate a task directory and run its configured test command."""
    if not is_inside_repo(task_path):
        print(f"Task path must be inside the repository: {task_path}")
        return 1

    if not task_path.exists() or not task_path.is_dir():
        print(f"Task path does not exist: {task_path}")
        return 1

    metadata, metadata_errors = load_task_metadata(task_path)
    file_errors = validate_required_files(task_path, metadata) if metadata else []
    errors = metadata_errors + file_errors

    if errors:
        print("Task validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print_task_summary(task_path, metadata)
    return run_test_command(task_path, metadata["test_command"])


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate and run tests for an AI Code Evaluation Lab task."
    )
    parser.add_argument("task_path", help="Path to the task directory to inspect.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    return score_task(resolve_task_path(args.task_path))


if __name__ == "__main__":
    raise SystemExit(main())
