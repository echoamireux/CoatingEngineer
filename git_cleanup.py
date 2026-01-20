import subprocess
import datetime
import sys

def run_command(command):
    try:
        # print(f"DEBUG: Executing {command}")
        result = subprocess.run(command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {command}")
        print(f"Error output: {e.stderr}")
        # Don't exit immediately on all errors, let caller handle or ignore (e.g. branch delete fail)
        raise e

def get_branches_sorted_by_date():
    # Use a pipe separator to avoid space issues with date formats
    output = run_command("git for-each-ref --sort=committerdate refs/heads/ --format='%(committerdate:iso8601)|%(refname:short)'")
    branches = []
    for line in output.split('\n'):
        if not line: continue
        parts = line.split('|')
        if len(parts) == 2:
            date_str, name = parts
            branches.append({'name': name.strip(), 'date': date_str.strip()})
    return branches

def main():
    # Configuration
    target_branch = "dev"
    # Branches to KEEP (not archive, not delete)
    keep_branches = {"main", "dev", "feature/cloud-function-passcode-refactor"}

    print("--- Starting Git Merge and Cleanup Process (V2) ---")

    # 0. Safety cleanup of any potential bad state
    try:
        run_command("git merge --abort")
        print("Aborted pending merge.")
    except:
        pass

    # 1. Checkout dev
    print(f"\n[1/5] Checking out {target_branch}...")
    run_command(f"git checkout {target_branch}")

    # 2. Get sorted branches
    print("\n[2/5] Assessing branches...")
    all_branches = get_branches_sorted_by_date()

    # Filter branches to archive:
    # We want to archive EVERYTHING that is NOT in keep_branches.
    to_archive = [b for b in all_branches if b['name'] not in keep_branches]

    print(f"Found {len(to_archive)} branches to archive history:")
    for b in to_archive:
        print(f"  - {b['name']} ({b['date']})")

    # 3. Archive Merge (Strategy: Ours)
    print("\n[3/5] Performing archive merges (strategy: ours)...")
    for b in to_archive:
        branch_name = b['name']
        print(f"  > Archiving {branch_name}...")
        try:
            # Check if already merged effectively (optional, but ours strategy doesn't hurt)
            run_command(f'git merge -s ours "{branch_name}" -m "chore: archive history of {branch_name}"')
        except Exception as e:
            print(f"    Warning: Failed to merge {branch_name}. Output: {e}")

    # 4. Merge Active Feature Branch (Standard Merge)
    active_feature = "feature/cloud-function-passcode-refactor"
    print(f"\n[4/5] Merging active feature branch {active_feature}...")
    try:
        run_command(f'git merge --no-ff "{active_feature}" -m "feat: merge cloud function passcode refactor"')
    except Exception as e:
         print(f"CRITICAL: Failed to merge active feature branch. You might need to resolve conflicts manually. Error: {e}")
         # We exit here because if the main merge fails, we probably shouldn't delete everything yet
         sys.exit(1)

    # 5. Cleanup
    print("\n[5/5] Cleaning up branches...")

    # Delete local branches
    for b in to_archive:
        branch_name = b['name']
        print(f"  > Deleting local {branch_name}...")
        try:
            run_command(f'git branch -D "{branch_name}"')
        except Exception as e:
             print(f"    Warning: Could not delete local {branch_name}. Error: {e}")

    # Delete remote branches
    print("  > Pruning remotes...")
    run_command("git fetch -p")

    print("  > Deleting remote branches...")
    for b in to_archive:
        branch_name = b['name']
        print(f"    - Delete origin/{branch_name}")
        try:
            run_command(f'git push origin --delete "{branch_name}"')
        except Exception as e:
            # Common error: branch doesn't exist on remote
            pass

    print("\n--- Process Complete! ---")
    print("Run 'git log --graph --oneline' to see the result.")

if __name__ == "__main__":
    main()
